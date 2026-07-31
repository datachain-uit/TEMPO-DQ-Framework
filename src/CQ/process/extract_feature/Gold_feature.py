# Databricks notebook source
import pandas as pd
from pyspark import SparkConf
from pyspark.sql import SparkSession, Row
from pyspark.sql.types import StructType, StructField, StringType
from pyspark.sql.functions import  col, countDistinct, avg, sum as _sum, stddev, min as _min, to_date, datediff,  to_timestamp,arrays_zip, max as _max,when, countDistinct,  try_divide, lit, concat
import pyspark.sql.functions as F
from pyspark.sql import Window

# COMMAND ----------

# MAGIC %md
# MAGIC # Feature-problem

# READ SELECT COLUMNS ----------

user = spark.read.format("delta").load("/mnt/silver/user_course")
problem = spark.read.format("delta").load("/mnt/silver/problem")
course_limit = spark.read.format("delta").load("/mnt/silver/course_limit")
course = spark.read.format("delta").load("/mnt/silver/course")
user_problem = spark.read.format("delta").load("/mnt/silver/user_problem")


user_problem = user_problem.select("problem_id",  "user_id",  "attempts", "score",  "submit_time", "is_correct")
course = course.select(
       col("id").alias('course_id'), 
       "resource_id", 
       "chapter")

user_problem_score = user_problem.join(problem,
                                       on = "problem_id"
                                       ).join(course,
                                              (course['resource_id'] == problem['exercise_id']) & (course['chapter'] == problem['location'])).drop('location').drop('resource_íd').join(user,
                                                                                                                                                                                          on = ['user_id', 'course_id']) \
                                                                                                                                                                                                 .join(course_limit,
                                                                                                                                                                                                                   on = ['course_id']) \
                                                                                                                                                          
user_problem_limit = user_problem_score.withColumn(
       'problem_dates_diff', 
       datediff('submit_time', 'enroll_time')) \
       .withColumn(
       "enroll_to_end",
       datediff(col("end_date"), col("enroll_time"))
    )


# PROBLEM FEATURE ----------

from pyspark.sql.functions import col, datediff
user_problem_score_not_limit = (

    user_problem
    .join(problem, on="problem_id")
    .join(
        course,
        (course["resource_id"] == problem["exercise_id"]) &
        (course["chapter"] == problem["location"])
    )
    .drop("location")
    .drop("resource_id")
    .join(user, on=["user_id", "course_id"])
)

# Lọc NGƯỢC: chỉ giữ course_id KHÔNG có trong course_limit
user_problem_score_not_limit = user_problem_score_not_limit.join(
    course_limit.select("course_id").distinct(),
    on="course_id",
    how="left_anti"     # <-- phần quan trọng
)

# Các cột thời gian
user_problem_score_not_limit = (
    user_problem_score_not_limit
    .withColumn("problem_dates_diff", datediff(col("submit_time"), col("enroll_time")))
)

# COMMAND ----------

user_problem_limit = (
    user_problem_limit
    .withColumn(
        "effective_total_days",
        when(col("enroll_to_end") > 0, col("enroll_to_end"))
         .otherwise(None)
    )
    .withColumn("has_limit", F.lit(1))
)

user_problem_not_limit = (
    user_problem_score_not_limit
    .withColumn("effective_total_days", F.lit(60))
    .withColumn("has_limit", F.lit(0))
)

user_problem_all = user_problem_limit.unionByName(
    user_problem_not_limit,
    allowMissingColumns=True
)

import pyspark.sql.functions as F
from pyspark.sql import Column

def add_phase_column(
    df,
    diff_col: str,
    total_col: Column,
    phase_col: str = "phase"
):
    return df.withColumn(
        phase_col,
        F.when(
            (F.col(diff_col).isNull()) |
            (total_col.isNull()) |
            (total_col <= 0),
            None
        )
        .when(F.col(diff_col) <= 0.25 * total_col, "Phase_1")
        .when(F.col(diff_col) <= 0.50 * total_col, "Phase_2")
        .when(F.col(diff_col) <= 0.75 * total_col, "Phase_3")
        .when(F.col(diff_col) <= 0.90 * total_col, "Phase_4")
    )


user_problem_all = add_phase_column(
    user_problem_all,
    diff_col="problem_dates_diff",
    total_col=col("effective_total_days")
).dropDuplicates()


def feature_problem(df):
    # B0: thay null score bằng 0
    df = df.withColumn(
        "score",
        when(col("score").isNull(), 0).otherwise(col("score"))
    )

    # B1: tổng số problem trong mỗi chapter của mỗi course
    max_chapter_exercise = (
        
        df.groupBy("course_id", "chapter")
        .agg(countDistinct("problem_id").alias("full_problem_chapter"))
    )

    # B1b: tổng full_score theo course_id, chapter
    total_full_score_chapter = (
        df.groupBy("course_id", "chapter")
        .agg(_sum("full_score").alias("full_score_sum"))
    )

    # B2: tổng hợp các đặc trưng theo user_id, course_id, chapter
    feature = df.groupBy("course_id", "user_id", "chapter").agg(
        countDistinct("problem_id").alias("problem_count"),
        countDistinct("exercise_id").alias("exercise_id_count"),
        countDistinct("context_id").alias("exercise_context_sum"),

        _sum((col("score") == col("full_score")).cast("int")).alias("problem_correct_sum"),
        avg((col("score") == col("full_score")).cast("int")).alias("problem_correct_mean"),
        stddev((col("score") == col("full_score")).cast("int")).alias("problem_correct_stddev"),

        avg(try_divide(col("score"), col("full_score"))).alias("problem_perc_correct_mean"),
        stddev(try_divide(col("score"), col("full_score"))).alias("problem_perc_real_correct_std"),

        _sum("score").alias("score_sum"),
        avg("score").alias("score_mean"),
        stddev("score").alias("score_std"),

        _sum((col("is_correct") == 0).cast("int")).alias("failed_problem_num_sum"),
        avg((col("is_correct") == 0).cast("int")).alias("failed_problem_num_mean"),
        stddev((col("is_correct") == 0).cast("int")).alias("failed_problem_num_std"),

        _sum(col("attempts")).alias("attempts_sum"),
        avg(col("attempts")).alias("attempts_mean"),
        stddev(col("attempts")).alias("attempts_std"),

        avg("problem_dates_diff").alias("avg_problem_summit_day"),
        _max("problem_dates_diff").alias("max_problem_submit_day"),
        _min("problem_dates_diff").alias("min_problem_submit_day"),
        stddev("problem_dates_diff").alias("std_problem_summit_day")
    )

    # B3: join tổng số problem và full_score của chapter
    feature = (
        feature
        .join(max_chapter_exercise, on=["course_id", "chapter"], how="left")
        .join(total_full_score_chapter, on=["course_id", "chapter"], how="left")
        .withColumn(
            "problem_id_ratio",
            try_divide(col("problem_count"), col("full_problem_chapter"))
        )
        .withColumn(
            "score_ratio",
            when(col("full_score_sum").isNull(), lit(1))  # Cả 2 đều null
            .when(col("score_sum").isNull() & col("full_score_sum").isNotNull(), lit(0))  # Score null, full_score có giá trị
            .when(col("score_sum") == col("full_score_sum"), lit(1))  # Hai giá trị bằng nhau
            .otherwise(try_divide(col("score_sum"), col("full_score_sum")))  # Chia bình thường
        )


    )

    # B4: scale problem_count, attempts_sum theo từng course_id, chapter
    w = Window.partitionBy("course_id", "chapter")

    feature = (
        feature
        .withColumn("min_problem_count", _min("problem_count").over(w))
        .withColumn("max_problem_count", _max("problem_count").over(w))
        .withColumn("min_attempts_sum", _min("attempts_sum").over(w))
        .withColumn("max_attempts_sum", _max("attempts_sum").over(w))
        # problem_count_scaled
        .withColumn(
            "problem_count_scaled",
            when(col("max_problem_count") == col("min_problem_count"), lit(1.0))
            .otherwise(
                try_divide(col("problem_count") - col("min_problem_count"),
                           col("max_problem_count") - col("min_problem_count"))
            )
        )
        # attempts_sum_scaled
        .withColumn(
            "attempts_sum_scaled",
            when(col("max_attempts_sum") == col("min_attempts_sum"), lit(1.0))
            .otherwise(
                try_divide(col("attempts_sum") - col("min_attempts_sum"),
                           col("max_attempts_sum") - col("min_attempts_sum"))
            )
        )
        .drop("min_problem_count", "max_problem_count", "min_attempts_sum", "max_attempts_sum")
    )

    return feature

# PROBLEM PHASES ----------

problem_p1 = user_problem_all.filter(col("phase") == "Phase_1")
problem_p2 = user_problem_all.filter(col("phase") == "Phase_2")
problem_p3 = user_problem_all.filter(col("phase") == "Phase_3")
problem_p4 = user_problem_all.filter(col("phase") == "Phase_4")

f_p_1 = feature_problem(problem_p1)
f_p_2 = feature_problem(problem_p2)
f_p_3 = feature_problem(problem_p3)
f_p_4 = feature_problem(problem_p4)


# USER VIDEO ----------

user_video = spark.read.format("delta").load("/mnt/silver/user_video")

course_video_limit = (
    user_video
    .join(course, course["resource_id"] == user_video["video_id"])
    .drop("video_id")
    .join(user, on=["user_id", "course_id"])
    .join(course_limit, on=["course_id"])
)

course_video_limit = (
    course_video_limit
    .filter(
        (col("end_point") >= col("start_point")) &
        (col("local_start_date") >= col("start_date")) &
        (col("local_start_date") <= col("end_date"))
    )
    .withColumn(
        "video_dates_diff",
        F.datediff(col("local_start_date"), col("enroll_time"))
    )
    .withColumn(
        "enroll_to_end",
        F.datediff(col("end_date"), col("enroll_time"))
    )
    .withColumn(
        "effective_total_days",
        col("enroll_to_end")
    )
    .withColumn("has_limit", F.lit(1))
)


course_video_not_limit = (
    user_video
    .join(course, course["resource_id"] == user_video["video_id"])
    .drop("resource_id")
    .join(user, on=["user_id", "course_id"])
    .join(
        course_limit,
        on=["course_id"],
        how="left_anti"
    )
    .filter(col("end_point") >= col("start_point"))
    .withColumn(
        "video_dates_diff",
        F.datediff(col("local_start_date"), col("enroll_time"))
    )
    .withColumn(
        "effective_total_days",
        F.lit(60)   # 🔥 DEFAULT cho course không limit
    )
    .withColumn("has_limit", F.lit(0))
)




# COMMAND ----------

course_video_all = course_video_limit.unionByName(
    course_video_not_limit,
    allowMissingColumns=True
)

course_video_all = add_phase_column(
    course_video_all,
    diff_col="video_dates_diff",
    total_col=col("effective_total_days"),
    phase_col="phase"
).dropDuplicates()




def feature_video(df):
    # B1: tính duration mỗi lần xem và số ngày từ enroll
    course_video = df.withColumn(
        "watch_duration", 
        (F.col("end_point") - F.col("start_point")).cast("float")
    )

    # B2: tính số lần coi video theo user-course-chapter-resource
    watch_df = (course_video
        .groupBy("user_id", "course_id", "chapter", "resource_id")
        .agg(F.count("*").alias("watch_count"))
    )

    # B3: tổng hợp chỉ số theo user_id, course_id, chapter
    features = (course_video
        .groupBy("user_id", "course_id", "chapter")
        .agg(
            F.sum("watch_duration").alias("total_watch_duration"),
            F.avg("watch_duration").alias("avg_watch_duration"),
            F.avg("speed").alias("avg_watch_speed"),
            F.countDistinct("resource_id").alias("total_video_watch_count"),
            F.max("watch_duration").alias("total_max_watch_duration"),
            F.min("watch_duration").alias("total_min_watch_duration"),
            F.max("video_dates_diff").alias("datediff_max"),
            F.min("video_dates_diff").alias("datediff_min"),
            F.avg("video_dates_diff").alias("datediff_avg")
        )
    )

    # B4: tổng số lần xem video
    watch_agg = (watch_df
        .groupBy("user_id", "course_id", "chapter")
        .agg(F.sum("watch_count").alias("total_watch_count"))
    )

    # B5: tổng số video trong mỗi chapter
    total_video_per_chapter = (course_video
        .select("course_id", "chapter", "resource_id")
        .distinct()
        .groupBy("course_id", "chapter")
        .agg(F.count("*").alias("chapter_total_video"))
    )

    # B6: join để tính tỷ lệ xem video
    final_features = (features
        .join(watch_agg, ["user_id", "course_id", "chapter"], "left")
        .join(total_video_per_chapter, ["course_id", "chapter"], "left")
        .withColumn(
            "video_watch_ratio",
            F.col("total_video_watch_count") / F.col("chapter_total_video")
        )
        .fillna(0, subset=["total_watch_count", "video_watch_ratio"])
    )

    # B7: scale Min–Max theo course_id, chapter
    w = Window.partitionBy("course_id", "chapter")

    final_features = (
        final_features
        # lấy min/max cho từng nhóm
        .withColumn("min_watch_count", F.min("total_watch_count").over(w))
        .withColumn("max_watch_count", F.max("total_watch_count").over(w))
        .withColumn("min_watch_duration", F.min("total_watch_duration").over(w))
        .withColumn("max_watch_duration", F.max("total_watch_duration").over(w))

        # tính scaled — nếu max == min thì = 1
        .withColumn(
            "total_watch_count_scaled",
            F.when(
                F.col("max_watch_count") == F.col("min_watch_count"),
                F.lit(1.0)
            ).otherwise(
                (F.col("total_watch_count") - F.col("min_watch_count")) /
                (F.col("max_watch_count") - F.col("min_watch_count"))
            )
        )
        .withColumn(
            "total_watch_duration_scaled",
            F.when(
                F.col("max_watch_duration") == F.col("min_watch_duration"),
                F.lit(1.0)
            ).otherwise(
                (F.col("total_watch_duration") - F.col("min_watch_duration")) /
                (F.col("max_watch_duration") - F.col("min_watch_duration"))
            )
        )
        # xóa cột tạm
        .drop("min_watch_count", "max_watch_count", "min_watch_duration", "max_watch_duration")
    ).dropDuplicates()

    return final_features

# VIDEO PHASES ----------

video_p1 = course_video_all.filter(col("phase") == "Phase_1")
video_p2 = course_video_all.filter(col("phase") == "Phase_2")
video_p3 = course_video_all.filter(col("phase") == "Phase_3")
video_p4 = course_video_all.filter(col("phase") == "Phase_4")



video_1= feature_video(video_p1)
video_2= feature_video(video_p2)
video_3= feature_video(video_p3)
video_4= feature_video(video_p4)



# COMMENT FEATURES ----------

## COMMENT HAVE 3 FILE c1: có comment_id, có sentiment
## c2: có course_id, user_id, chapter, sentiment nhưng không có comment_id
## comment: có course_id, user_id, chapter nhưng không có sentiment dung để join với c1, c2 để lấy text và create_time
## CODE PROCESS COMMENT: join c1, c2 với comment để lấy text và create_time, sau đó union lại thành comment_all SAU ĐÓ JOIN VỚI PROBLEM + VIDEO để lấy feature comment theo từng phase của problem và video 

c1 = spark.read.format("delta").load("/mnt/silver/sentiment")
c2 = spark.read.format("delta").load("/mnt/silver/sentiment_m1")
course_comment = spark.read.format("delta").load("/mnt/silver/course_comment")
comment = spark.read.format("delta").load("/mnt/silver/comment")

comment = comment.select(
    col('text'),
    col('create_time'),
    col('user_id'),
    col('id').alias('comment_id'),
    col('resource_id')
).join(course_comment,
       on = ['comment_id']) \
                          .join(course,
                                on = ['course_id', 'resource_id']) \
                                    .select("course_id", concat(lit("U_"), col("user_id")).alias("user_id"),"chapter","create_time")
                                

c1 = c1.select("id", "user_id", "resource_id", "create_time", "label","text") \
    .withColumnRenamed("label", "sentiment") \
    .withColumnRenamed("id", "comment_id")
c2 = c2.select("course_id","user_id","chapter","sentiment", "text")

# COMMENT 1 ----------

comment_c1 = c1.join(course_comment,
                      on = 'comment_id') \
                          .join(course,
                                on = ['course_id', 'resource_id']) \
                                    .select("course_id","user_id","chapter","sentiment", "text")

comment_all = comment_c1.unionByName(c2).join(comment,
                                              on = ['course_id', 'user_id', 'chapter'])



def join_problem_video_comment(problem_df, video_df, comment_df, with_time=False):
    p = problem_df.alias("p")
    v = video_df.alias("v")
    c = comment_df.alias("c")

    cols = [
        F.col("course_id"),
        F.col("c.sentiment"),
        F.col("user_id"),
        F.col("chapter"),
        F.col("c.text")
    ]

    if with_time:
        cols.append(F.col("c.create_time"))
        cols.append(F.col("v.enroll_time").alias("enroll_time"))

    return (
        p.join(v, on=["course_id", "user_id", "chapter"], how="outer")
         .join(c, on=["course_id", "user_id", "chapter"])
         .select(*cols)
    )



c_p1 = join_problem_video_comment(problem_p1, video_p1, comment_all, with_time=True)
c_p2 = join_problem_video_comment(problem_p2, video_p2, comment_all, with_time=True)
c_p3 = join_problem_video_comment(problem_p3, video_p3, comment_all, with_time=True)
c_p4 = join_problem_video_comment(problem_p4, video_p4, comment_all, with_time=True)

# COMMENT FEATURES ----------

def feature(df):
    # loại duplicate an toàn
    df = df.dropDuplicates()

    # xử lý text + word count
    df = df.withColumn(
        "word_count",
        F.size(
            F.split(
                F.trim(F.coalesce(F.col("text"), F.lit(""))),
                "\\s+"
            )
        )
    ).withColumn(
        "date_diff",
        F.datediff(F.col("create_time"), F.col("enroll_time"))
    )

    # group theo course_id, user_id, chapter
    grouped = (
        df.groupBy("course_id", "user_id", "chapter")
        .agg(
            F.count(F.col("text")).alias("count_comment"),

            F.avg("word_count").alias("avg_word_comment"),
            F.max("word_count").alias("max_word_comment"),
            F.min("word_count").alias("min_word_comment"),

            # sentiment count
            F.sum(F.when(F.col("sentiment") == "positive", 1).otherwise(0)).alias("count_positive"),
            F.sum(F.when(F.col("sentiment") == "neutral", 1).otherwise(0)).alias("count_neutral"),
            F.sum(F.when(F.col("sentiment") == "negative", 1).otherwise(0)).alias("count_negative"),

            # 🔥 date_diff features
            F.max("date_diff").alias("max_date_comment"),
            F.min("date_diff").alias("min_date_comment"),
            F.avg("date_diff").alias("avg_date_comment"),
        )
    )

    # sentiment ratio (tránh chia cho 0)
    grouped = (
        grouped
        .withColumn(
            "positive_ratio",
            F.when(F.col("count_comment") > 0,
                   F.col("count_positive") / F.col("count_comment")).otherwise(F.lit(0))
        )
        .withColumn(
            "neutral_ratio",
            F.when(F.col("count_comment") > 0,
                   F.col("count_neutral") / F.col("count_comment")).otherwise(F.lit(0))
        )
        .withColumn(
            "negative_ratio",
            F.when(F.col("count_comment") > 0,
                   F.col("count_negative") / F.col("count_comment")).otherwise(F.lit(0))
        )
    )

    # window: avg comment / user theo course + chapter
    grouped = grouped.withColumn(
        "avg_comment_per_user",
        F.avg("count_comment").over(
            Window.partitionBy("course_id", "chapter")
        )
    )

    return grouped

# COMMENT PHASE ----------

f_cp1 = feature(c_p1)
f_cp2 = feature(c_p2)
f_cp3 = feature(c_p3)
f_cp4 = feature(c_p4)
f_cp1.count()


# CONCEPT FEATURES ----------

concept_comemnt = spark.read.format('delta').load('/mnt/silver/concept_comment')
concept_problem = spark.read.format('delta').load('/mnt/silver/concept_problem')
concept_videp = spark.read.format('delta').load('/mnt/silver/concept_video')


# SAVE FOR MERGE  ----------

f_p_1.write.format("delta").mode("overwrite").save("/mnt/gold/feature_problem/p1")
f_p_2.write.format("delta").mode("overwrite").save("/mnt/gold/feature_problem/p2")
f_p_3.write.format("delta").mode("overwrite").save("/mnt/gold/feature_problem/p3")
f_p_4.write.format("delta").mode("overwrite").save("/mnt/gold/feature_problem/p4")

video_1.write.format("delta").mode("overwrite").save("/mnt/gold/feature_video/p1")
video_2.write.format("delta").mode("overwrite").save("/mnt/gold/feature_video/p2")
video_3.write.format("delta").mode("overwrite").save("/mnt/gold/feature_video/p3")
video_4.write.format("delta").mode("overwrite").save("/mnt/gold/feature_video/p4")

f_cp1.write.format("delta").mode("overwrite").save("/mnt/gold/feature_comment/p1")
f_cp2.write.format("delta").mode("overwrite").save("/mnt/gold/feature_comment/p2")
f_cp3.write.format("delta").mode("overwrite").save("/mnt/gold/feature_comment/p3")
f_cp4.write.format("delta").mode("overwrite").save("/mnt/gold/feature_comment/p4")

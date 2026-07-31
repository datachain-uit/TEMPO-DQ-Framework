# Databricks notebook source
import pandas as pd
from pyspark import SparkConf
from pyspark.sql import SparkSession, Row
from pyspark.sql.types import StructType, StructField, StringType
from pyspark.sql.functions import  col, countDistinct, avg, sum as _sum, stddev, min as _min, to_date, datediff,  to_timestamp,arrays_zip, max as _max,when, sqrt, lit
import pyspark.sql.functions as F
from pyspark.sql import Window

# READ FILE AND JOIN ----------

p1 = spark.read.format("delta").load("/mnt/gold/feature_problem/p1")
p2 = spark.read.format("delta").load("/mnt/gold/feature_problem/p2")
p3 = spark.read.format("delta").load("/mnt/gold/feature_problem/p3")
p4 = spark.read.format("delta").load("/mnt/gold/feature_problem/p4")

v1   = spark.read.format("delta").load("/mnt/gold/feature_video/p1")
v2   = spark.read.format("delta").load("/mnt/gold/feature_video/p2")
v3   = spark.read.format("delta").load("/mnt/gold/feature_video/p3")
v4   = spark.read.format("delta").load("/mnt/gold/feature_video/p4")

c1 = spark.read.format("delta").load("/mnt/gold/feature_comment/p1")
c2 = spark.read.format("delta").load("/mnt/gold/feature_comment/p2")
c3 = spark.read.format("delta").load("/mnt/gold/feature_comment/p3")
c4 = spark.read.format("delta").load("/mnt/gold/feature_comment/p4")


m1 = p1.join(v1, on = ["user_id", "course_id", "chapter"], how = 'outer').join(c1, on = ["course_id", "user_id", "chapter"], how = 'left')

m2 = p2.join(v2, on = ["user_id", "course_id", "chapter"], how = 'outer').join(c2, on = ["course_id", "user_id", "chapter"], how = 'left')

m3 = p3.join(v3, on = ["user_id", "course_id", "chapter"], how = 'outer').join(c3, on = ["course_id", "user_id", "chapter"], how = 'left')

m4 = p4.join(v4, on = ["user_id", "course_id", "chapter"], how = 'outer').join(c4, on = ["course_id", "user_id", "chapter"], how = 'left')


course = spark.read.format("delta").load("/mnt/silver/course")
course = course.withColumnRenamed('id', 'course_id')

# ADD PREFIX FOR CALCULATION ----------

df_check = (
    course.withColumn("prefix", F.substring("resource_id", 1, 2))  # lấy 2 ký tự đầu
      .groupBy("course_id", "chapter")
      .agg(
          F.collect_set("prefix").alias("prefix_set")  # tập hợp các prefix trong nhóm
      )
      .withColumn(
          "check",
          F.when(F.array_contains(F.col("prefix_set"), "V_") & ~F.array_contains(F.col("prefix_set"), "Ex"), 0)
           .when(~F.array_contains(F.col("prefix_set"), "V_") & F.array_contains(F.col("prefix_set"), "Ex"), 1)
           .when(F.array_contains(F.col("prefix_set"), "V_") & F.array_contains(F.col("prefix_set"), "Ex"), 2)
           .otherwise(None)
      )
)


# COURSE STRUCTURE ----------

course_Struct =  spark.read.format("csv").option("header", "true").load("/mnt/raw/csv/course_ScoreStruct.csv")
course_Struct = course_Struct.withColumnRenamed('id', 'course_id').select('course_id','activities', 'point','proportion')
course_Struct.show()

course_for_label = course_Struct.select(col('course_id')) \
    .join(df_check, on='course_id', how='outer')
course_for_label.show(1)


# COELO ----------


from functools import reduce

def calculate_COELO(data,
                    cols_check_0=["total_watch_duration_scaled", "video_watch_ratio"],
                    cols_check_1=["attempts_sum_scaled", "problem_id_ratio"],
                    key_cols=["course_id", "chapter"]):
    TS = data.select('course_id', 'user_id', 'chapter', 'total_watch_duration_scaled')
    RV = data.select('course_id', 'user_id', 'chapter', 'video_watch_ratio')
    IF = data.select('course_id', 'user_id', 'chapter', 'attempts_sum_scaled')
    AV = data.select('course_id', 'user_id', 'chapter', 'problem_id_ratio')
    temp_COELO = TS.join(RV,on=['course_id', 'user_id', 'chapter'], how='inner').join(IF, on=['course_id', 'user_id', 'chapter'], how='inner').join(AV,on=['course_id', 'user_id', 'chapter'], how='inner').join(course_for_label, on= ['course_id', 'chapter'])
    # === B1. Fill null theo logic của 'check' ===
    numeric_cols = [
        f.name for f in temp_COELO.schema.fields
        if f.dataType.simpleString() in ("int", "double", "float", "long")
    ]

    df = temp_COELO

    # check = 2 → fill 0 toàn bộ numeric
    for c in numeric_cols:
        df = df.withColumn(
            c, when((col("check") == 2) & col(c).isNull(), 0).otherwise(col(c))
        )

    # check = 0 → fill 0 cho 2 cột video
    for c in cols_check_0:
        if c in df.columns:
            df = df.withColumn(
                c, when((col("check") == 0) & col(c).isNull(), 0).otherwise(col(c))
            )

    # check = 1 → fill 0 cho 2 cột problem
    for c in cols_check_1:
        if c in df.columns:
            df = df.withColumn(
                c, when((col("check") == 1) & col(c).isNull(), 0).otherwise(col(c))
            )

    all_cols = list(set(cols_check_0 + cols_check_1))

    # === B2. Tính trung bình ACELO (bỏ qua NULL) ===
    sum_expr = reduce(
        lambda a, b: a + b,
        [when(col(c).isNotNull(), col(c)).otherwise(lit(0)) for c in all_cols]
    )
    count_expr = reduce(
        lambda a, b: a + b,
        [when(col(c).isNotNull(), lit(1)).otherwise(lit(0)) for c in all_cols]
    )

    df = df.withColumn("COELO", sum_expr / count_expr).dropDuplicates()


    return df



COELO_m1 = calculate_COELO(m1)
COELO_m2 = calculate_COELO(m2)
COELO_m3 = calculate_COELO(m3)
COELO_m4 = calculate_COELO(m4)
COELO_m1.show(1)

# AFELO ----------


def calculate_AFELO(data):
    FV = data.select('course_id', 'user_id', 'chapter', 'total_watch_count_scaled')
    AEF = data.select('course_id', 'user_id', 'chapter', 'problem_count', 'count_comment')
    df = FV.join(AEF, on=['course_id', 'user_id', 'chapter'], how='inner').join(course_for_label, on= ['course_id', 'chapter'])

    # === B1. Tính AEF ===
    df = df.withColumn(
        "AEF",
        when(col("check") == 0,
             ((col("total_watch_count_scaled").isNotNull().cast("int") +
               col("count_comment").isNotNull().cast("int")) / 2))
        .when(col("check") == 1,
              ((col("problem_count").isNotNull().cast("int") +
                col("count_comment").isNotNull().cast("int")) / 2))
        .when(col("check") == 2,
              ((col("total_watch_count_scaled").isNotNull().cast("int") +
                col("problem_count").isNotNull().cast("int") +
                col("count_comment").isNotNull().cast("int")) / 3))
        .otherwise(0)
    )

    # === B2. Fill NULL ===
    df = df.withColumn(
        "total_watch_count_scaled",
        when((col("check").isin(0, 2)) & col("total_watch_count_scaled").isNull(), 0)
        .otherwise(col("total_watch_count_scaled"))
    )

    df = df.withColumn(
        "count_comment",
        when(col("count_comment").isNull(), 0).otherwise(col("count_comment"))
    )

    # === B3. Tính AFELO_mean (trung bình bỏ NULL) ===
    cols = ["total_watch_count_scaled", "AEF"]

    sum_expr = reduce(
        lambda a, b: a + b,
        [when(col(c).isNotNull(), col(c)).otherwise(lit(0)) for c in cols]
    )

    count_expr = reduce(
        lambda a, b: a + b,
        [when(col(c).isNotNull(), lit(1)).otherwise(lit(0)) for c in cols]
    )

    df = df.withColumn(
        "AFELO_mean",
        when(count_expr == 0, lit(None)).otherwise(sum_expr / count_expr)
    )
    df = df.dropDuplicates()
    return df


AFELO_m1 = calculate_AFELO(m1)
AFELO_m2 = calculate_AFELO(m2)
AFELO_m3 = calculate_AFELO(m3)
AFELO_m4 = calculate_AFELO(m4)
AFELO_m1.show(1)



# ACELO ----------

course_ACELO = course_Struct.select('course_id', 'proportion', 'activities')
course_ACELO_video = course_ACELO.filter(col('activities') == 'Video')
course_ACELO_assignment = course_ACELO.filter(col('activities') == 'Assignment')
course_ACELO_assignment = course_ACELO_assignment.withColumnRenamed('proportion', 'proportion_assignment')
course_ACELO_final = course_ACELO_assignment.join(course_ACELO_video, on = ['course_id'], how = 'outer')
course_ACELO_final.fillna('0')


FS_m1 = m1.select('course_id', 'user_id', 'chapter', 'video_watch_ratio', 'score_ratio').join(course_for_label, on= ['course_id', 'chapter']) \
    .join(course_ACELO_final, on = ['course_id'], how = 'inner').dropDuplicates()

FS_m2 = m2.select('course_id', 'user_id', 'chapter', 'video_watch_ratio', 'score_ratio').join(course_for_label, on= ['course_id', 'chapter']) \
    .join(course_ACELO_final, on = ['course_id'], how = 'inner').dropDuplicates()

FS_m3 = m3.select('course_id', 'user_id', 'chapter', 'video_watch_ratio', 'score_ratio').join(course_for_label, on= ['course_id', 'chapter']) \
    .join(course_ACELO_final, on = ['course_id'], how = 'inner').dropDuplicates()

FS_m4 = m4.select('course_id', 'user_id', 'chapter', 'video_watch_ratio', 'score_ratio').join(course_for_label, on= ['course_id', 'chapter']) \
    .join(course_ACELO_final, on = ['course_id'], how = 'inner').dropDuplicates()


def calculate_ACELO(FS):
    # === Tính total_ratio theo check ===
    FS = FS.withColumn(
        "total_ratio",
        when(col("check") == 0,
             when(col("video_watch_ratio").isNull(), lit(0))
             .otherwise(col("video_watch_ratio") * col("proportion") / 100)
        )
        .when(col("check") == 1,
             col("score_ratio") * col("proportion_assignment") / 100
        )
        .when(col("check") == 2,
             (when(col("video_watch_ratio").isNull(), lit(0))
              .otherwise(col("video_watch_ratio") * col("proportion") / 100))
             + (col("score_ratio") * col("proportion_assignment") / 100)
        )
        .otherwise(lit(0))
    )

    # === Window theo course_id, chapter ===
    w = Window.partitionBy("course_id", "chapter")

    FS = FS.withColumn("min_val", _min(col("total_ratio")).over(w))
    FS = FS.withColumn("max_val", _max(col("total_ratio")).over(w))

    # === Scale Min-Max theo nhóm, nếu min = max thì = 1 ===
    FS = FS.withColumn(
        "total_ratio_scaled",
        when(col("min_val") == col("max_val"), lit(1.0))
        .otherwise((col("total_ratio") - col("min_val")) / (col("max_val") - col("min_val")))
    )

    # Loại bỏ cột min/max tạm
    FS = FS.drop("min_val", "max_val").dropDuplicates()

    return FS



ACELO_m1 = calculate_ACELO(FS_m1)
ACELO_m2 = calculate_ACELO(FS_m2)
ACELO_m3 = calculate_ACELO(FS_m3)
ACELO_m4 = calculate_ACELO(FS_m4)
ACELO_m1.show(1)


# VECTOR FINAL AND LABELING ----------

def vector_final(COELO, AFELO, ACELO):
    # Chọn cột cần thiết
    COELO = COELO.select('course_id', 'chapter', 'COELO')
    AFELO = AFELO.select('course_id', 'chapter', 'AFELO_mean')
    ACELO = ACELO.select('course_id', 'chapter', 'total_ratio_scaled')
    
    # Join các bảng
    vector = ACELO.join(AFELO, on=['course_id', 'chapter'], how='inner') \
                  .join(COELO, on=['course_id', 'chapter'], how='inner')
    
    # Group theo course_id và chapter, tính trung bình
    vector_avg = vector.groupBy('course_id', 'chapter').agg(
        avg('total_ratio_scaled').alias('total_ratio_scaled_avg'),
        avg('AFELO_mean').alias('AFELO_mean_avg'),
        avg('COELO').alias('COELO_scaled_avg')
    )
    
    # Tính khoảng cách Euclidean tới vector [1,1,1], bỏ qua NULL
    distance_expr = (
        sqrt(
            when(col('total_ratio_scaled_avg').isNotNull(), (col('total_ratio_scaled_avg')-1)**2).otherwise(0) +
            when(col('AFELO_mean_avg').isNotNull(), (col('AFELO_mean_avg')-1)**2).otherwise(0) +
            when(col('COELO_scaled_avg').isNotNull(), (col('COELO_scaled_avg')-1)**2).otherwise(0)
        ) /
        (
            when(col('total_ratio_scaled_avg').isNotNull(), 1).otherwise(0) +
            when(col('AFELO_mean_avg').isNotNull(), 1).otherwise(0) +
            when(col('COELO_scaled_avg').isNotNull(), 1).otherwise(0)
        )
    )
    
    vector_avg = vector_avg.withColumn("euclidean_distance", distance_expr)
    
    # Tính trung bình khoảng cách
    
    return vector_avg

vector_m1 = vector_final(COELO_m1, AFELO_m1, ACELO_m1)
vector_m2 = vector_final(COELO_m2, AFELO_m2, ACELO_m2)
vector_m3 = vector_final(COELO_m3, AFELO_m3, ACELO_m3)
vector_m4 = vector_final(COELO_m4, AFELO_m4, ACELO_m4)

vector_m1.show()


# COMMAND ----------

df1 = (
    vector_m1
    .select("course_id", "chapter", "euclidean_distance")
    .withColumnRenamed("euclidean_distance", "euclid_to_111")
)

df2 = (
    vector_m2
    .select("course_id", "chapter", "euclidean_distance")
    .withColumnRenamed("euclidean_distance", "euclid_to_111")
)

df3 = (
    vector_m3
    .select("course_id", "chapter", "euclidean_distance")
    .withColumnRenamed("euclidean_distance", "euclid_to_111")
)

df4 = (
    vector_m4
    .select("course_id", "chapter", "euclidean_distance")
    .withColumnRenamed("euclidean_distance", "euclid_to_111")
)


# COMMAND ----------

bins = [0.0, 0.2, 0.31, 1.0]
labels = ['excellent', 'good', 'average']

def add_label(df):
    return (
        df.withColumn(
            "label",
            F.when(F.col("euclid_to_111") <= 0.2, "excellent")
             .when(
                 (F.col("euclid_to_111") > 0.2) & (F.col("euclid_to_111") <= 0.4),
                 "good"
             )
             .when(
                 (F.col("euclid_to_111") > 0.4) & (F.col("euclid_to_111") <= 1.0),
                 "average"
             )
             .otherwise(None)
        )
    )


# COMMAND ----------

df1 = add_label(df1)
df2 = add_label(df2)
df3 = add_label(df3)
df4 = add_label(df4)

df1.show(5)
df1.printSchema()


# COMMAND ----------

df1.write \
    .format("delta") \
    .mode("overwrite") \
    .save("/mnt/gold/course_label/p1")

df2.write \
    .format("delta") \
    .mode("overwrite") \
    .save("/mnt/gold/course_label/p2")

df3.write \
    .format("delta") \
    .mode("overwrite") \
    .save("/mnt/gold/course_label/p3")

df4.write \
    .format("delta") \
    .mode("overwrite") \
    .save("/mnt/gold/course_label/p4")
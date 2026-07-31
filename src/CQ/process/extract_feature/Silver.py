# Databricks notebook source
import pandas as pd
from pyspark import SparkConf
from pyspark.sql import SparkSession, Row
from pyspark.sql.functions import explode, col, sum as _sum, count, concat, lit, split
from pyspark.sql.types import StructType, StructField, StringType
from pyspark.sql.functions import  col, countDistinct, avg, sum as _sum, stddev, min as _min, to_date, datediff,  to_timestamp,arrays_zip, max as _max,when, countDistinct
from pyspark.sql import functions as F

# COMMAND ----------

user = spark.read.format("delta").load("/mnt/silver/user")
problem = spark.read.format("delta").load("/mnt/silver/problem")
course_limit = spark.read.format("delta").load("/mnt/silver/course_limit")
user_video = spark.read.format("delta").load("/mnt/silver/user_video")

# PROBLEM ----------

problem = problem.withColumnRenamed('score', 'full_score')
problem = problem.withColumn('problem_id', concat(lit('Pm_'), col('problem_id')))
problem = problem.select(
    'exercise_id',
    'location',
    'problem_id',
    'full_score',
    'context_id',
)

# USER ----------


# user = (
#     user.select('id', 'year_of_birth', 'gender', 'course_order', 'enroll_time')
#     .withColumn(
#         "course_order_arr",
#         F.split(F.regexp_replace("course_order", r"[\[\]']", ""), ",")
#     )
#     .withColumn(
#         "enroll_time_arr",
#         F.split(F.regexp_replace("enroll_time", r"[\[\]']", ""), ",")
#     )
#     .withColumn(
#         "course_order_arr",
#         F.expr("filter(transform(course_order_arr, x -> trim(x)), x -> x != '')")
#     )
#     .withColumn(
#         "enroll_time_arr",
#         F.expr("filter(transform(enroll_time_arr, x -> trim(x)), x -> x != '')")
#     )
# )

# EXPLODE COURSE ORDER + ENROLL TIME ----------
user_course = (
    user
    .withColumn("zipped", F.arrays_zip("course_order", "enroll_time"))
    .withColumn("zipped", F.explode("zipped"))
    .select(
        F.col("id").alias("user_id"),
        "year_of_birth",
        "gender",
        F.concat(F.lit("C_"), F.col("zipped.course_order")).alias("course_id"),
        F.to_timestamp(
            F.trim(
                F.regexp_replace("zipped.enroll_time", "[\"']", "")
            ),
            "yyyy-MM-dd HH:mm:ss"
        ).alias("enroll_time")
    )
)




# VIDEO PROCESS ----------

from pyspark.sql.types import *
# Bước 1: explode seq để lấy từng video
df_video = user_video.withColumn("video", explode(col("seq")))

# Bước 2: explode segment để lấy từng lượt xem cụ thể
df_segment = df_video.withColumn("segment", explode(col("video.segment")))

df_selected = (
    df_segment
    .select(
        col("user_id"),
        col("video.video_id").alias("video_id"),
        col("segment.start_point").alias("start_point"),
        col("segment.end_point").alias("end_point"),
        col("segment.speed").alias("speed"),
        col("segment.local_start_time").alias("local_start_time")
    )
    .filter(col("end_point") >= col("start_point"))
    .withColumn(
        "local_start_date",
        F.to_date(F.from_unixtime(col("local_start_time")))
    )
    .drop("local_start_time")
)



# COURSE LIMIT (TAKE TIME LIMIT OF COURSE) ----------

def explode_date_arrays(
    df,
    start_col="start_date",
    end_col="end_date",
    id_col="course_id"
):
    """
    Convert string array columns like:
    "['2020-01-01','2020-02-01']"
    into exploded rows:

    course_id | start_date | end_date
    ---------------------------------
       1      | 2020-01-01 | 2020-01-15
       1      | 2020-02-01 | 2020-02-20
    """

    # 1. Remove [ ] and '
    df = df.withColumn(
        "start_arr",
        F.split(F.regexp_replace(start_col, r"[\[\]']", ""), ",")
    ).withColumn(
        "end_arr",
        F.split(F.regexp_replace(end_col, r"[\[\]']", ""), ",")
    )

    # 2. Trim + remove empty
    df = df.withColumn(
        "start_arr",
        F.expr("filter(transform(start_arr, x -> trim(x)), x -> x != '')")
    ).withColumn(
        "end_arr",
        F.expr("filter(transform(end_arr, x -> trim(x)), x -> x != '')")
    )

    # 3. Zip 2 arrays
    df = df.withColumn("zipped", F.arrays_zip("start_arr", "end_arr"))

    # 4. Explode
    df = df.withColumn("zipped", F.explode("zipped"))

    # 5. Select columns
    df = df.select(
        F.col(id_col),
        F.col("zipped.start_arr").alias("start_date"),
        F.col("zipped.end_arr").alias("end_date")
    )

    # 6. Cast to date
    df = df.withColumn("start_date", F.to_date("start_date")) \
           .withColumn("end_date", F.to_date("end_date"))

    # 7. Drop invalid rows
    df = df.dropna(subset=["start_date", "end_date"])
    df = df.select("course_id", "start_date", "end_date")
    return df

course_limit_silver = explode_date_arrays(course_limit)


# WRITE TO DELTA ----------

user_course.write \
    .format("delta") \
    .mode("overwrite") \
    .option("overwriteSchema", "true") \
    .save("/mnt/silver/user_course")

course_limit_silver.write \
    .format("delta") \
    .mode("overwrite") \
    .option("overwriteSchema", "true") \
    .save("/mnt/silver/course_limit")


# df_selected là dataframe đã được xử lý từ user_video, chứa thông tin về các lượt xem video của người dùng. 
df_selected.write \
    .format("delta") \
    .mode("overwrite") \
    .option("overwriteSchema", "true") \
    .save("/mnt/silver/user_video")

problem.write \
    .format("delta") \
    .mode("overwrite") \
    .option("overwriteSchema", "true") \
    .save("/mnt/silver/problem")

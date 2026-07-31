# Databricks notebook source
import pandas as pd
from pyspark import SparkConf
from pyspark.sql import SparkSession, Row
from pyspark.sql.functions import explode, col, sum as _sum, count, concat, lit, split
from pyspark.sql.types import StructType, StructField, StringType
from pyspark.sql.functions import  col, countDistinct, avg, sum as _sum, stddev, min as _min, to_date, datediff,  to_timestamp,arrays_zip, max as _max,when, countDistinct

# CODE NÀY ĐỂ MERGE THEO NGUYÊN TÁC VIDEO VÀ PROBLEM SẼ MERGE THEO OUTER, CÁC FACTOR KHÁC SẼ MERGE THEO LEFT NHÀM TRÁNH VIỆC TẠO NÊN DỮ LIỆU DƯ THỪA ----------

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

l1 = spark.read.format("delta").load("/mnt/gold/course_label/p1")
l2 = spark.read.format("delta").load("/mnt/gold/course_label/p2")
l3 = spark.read.format("delta").load("/mnt/gold/course_label/p3")
l4 = spark.read.format("delta").load("/mnt/gold/course_label/p4")

school = spark.read.format("delta").load("/mnt/silver/school").select("name_en", col("id").alias('school_id'))

course_school =spark.read.format("delta").load("/mnt/silver/course_school").select("course_id", "school_id")

teacher = spark.read.format("delta").load("/mnt/silver/teacher")
teacher = teacher.select(
    col('id').alias('teacher_id'),
    col('job_title'),
    col('org_name')
)

course_teacher = spark.read.format("delta").load("/mnt/silver/course_teacher").select("course_id", "teacher_id")

university_rank = spark.read.format("delta").load("/mnt/silver/university")
university_rank = university_rank.select(
    col('University'),
    col('Rank'),
    col('type_of_rank')
)

user = spark.read.format("delta").load("/mnt/silver/user")
user = user.select(
    col('user_id'),
    col('gender'),
    col('year_of_birth'))

# COMMAND ----------

school_rank = university_rank.join(school, school.name_en == university_rank.University).join(
    course_school,
    course_school.school_id == school.school_id
).drop(course_school.school_id)

course_info= school_rank.select(
    col('school_id'),
    col('Rank'),
    col('type_of_rank'),
    col('course_id')
)

teacher_course = course_teacher.join(
    teacher,
    on = 'teacher_id'
)

# COMMAND ----------

m1 = p1.join(v1, on = ["user_id", "course_id", "chapter"], how = 'outer').join(c1, on = ["course_id", "user_id", "chapter"], how = 'left') \
    .join(course_teacher, on = 'course_id', how = 'left') \
    .join(course_info, on = 'course_id', how = 'left') \
    .join(l1, on = ['course_id', 'chapter']).dropDuplicates()

m2 = p2.join(v2, on = ["user_id", "course_id", "chapter"], how = 'outer').join(c2, on = ["course_id", "user_id", "chapter"], how = 'left')\
    .join(course_teacher, on = 'course_id', how = 'left') \
    .join(course_info, on = 'course_id', how = 'left') \
    .join(l2, on = ['course_id', 'chapter']).dropDuplicates()

m3 = p3.join(v3, on = ["user_id", "course_id", "chapter"], how = 'outer').join(c3, on = ["course_id", "user_id", "chapter"], how = 'left')\
    .join(course_teacher, on = 'course_id', how = 'left') \
    .join(course_info, on = 'course_id', how = 'left') \
    .join(l3, on = ['course_id', 'chapter']).dropDuplicates()

m4 = p4.join(v4, on = ["user_id", "course_id", "chapter"], how = 'outer').join(c4, on = ["course_id", "user_id", "chapter"], how = 'left') \
    .join(course_teacher, on = 'course_id', how = 'left') \
    .join(course_info, on = 'course_id', how = 'left') \
    .join(l4, on = ['course_id', 'chapter']).dropDuplicates()

# COMMAND ----------



# COMMAND ----------

import matplotlib.pyplot as plt
from pyspark.sql.functions import col

def plot_label_distribution(spark_df, label_col='label', level_order=None, bar_color='lightcoral', title='Phân bố nhãn'):
    """
    Vẽ biểu đồ cột phân bố nhãn từ cột label trong PySpark DataFrame.

    Parameters:
    - spark_df: PySpark DataFrame
    - label_col: tên cột nhãn
    - level_order: danh sách thứ tự các nhãn
    - bar_color: màu cột
    - title: tiêu đề biểu đồ
    """
    # Chuyển sang Pandas
    pdf = spark_df.select(label_col).toPandas()
    
    # Nếu level_order có, sắp xếp lại thứ tự
    if level_order:
        counts = pdf[label_col].value_counts().reindex(level_order)
    else:
        counts = pdf[label_col].value_counts()
    
    # Vẽ biểu đồ cột
    plt.figure(figsize=(8,5))
    bars = plt.bar(counts.index, counts.values, color=bar_color, edgecolor='black')
    
    # Gắn nhãn số lượng lên đầu cột
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, height + 0.2, str(int(height)), ha='center', va='bottom')
    
    plt.title(title)
    plt.xlabel('Label')
    plt.ylabel('Số lượng')
    plt.xticks(rotation=30)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.show()


# COMMAND ----------

level_order = ['excellent', 'good', 'average']
plot_label_distribution(m1, label_col='label', level_order=level_order, bar_color='skyblue', title='Phân bố nhãn Euclidean Distance')


# COMMAND ----------

m1.write \
  .format("delta") \
  .mode("overwrite") \
  .save("/mnt/gold_ml/training_dataset")
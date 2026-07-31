# Data Processing Pipeline - Delta Lake

## Overview

This repository contains a data processing pipeline built on **Delta
Lake** following the **Medallion Architecture**.

The pipeline transforms raw data into structured datasets suitable for
**analytics and machine learning**.

The pipeline consists of two main layers:

-   **Silver Layer**: Cleans and standardizes data from the Bronze
    layer.
-   **Gold Layer**: Builds features and labels for analytics or machine
    learning models.

------------------------------------------------------------------------

## Pipeline Architecture

    Bronze (Raw Data)
            │
            ▼
       Silver Layer
     (Cleaning & Standardization)
            │
            ▼
       Gold Layer
     ┌───────────────┬───────────────┐
     ▼               ▼
    Gold_feature     Gold_label
            │
            ▼
         Gold_merge
     (Final Training Dataset)

------------------------------------------------------------------------

## Project Structure

    imputation/
    │
    ├── Silver.py
    ├── Gold_feature.py
    ├── Gold_label.py
    └── Gold_merge.py

------------------------------------------------------------------------

# Silver Layer

## `Silver.py`

This script performs basic data processing from the Bronze layer.

### Processing Steps

-   Data cleaning
-   Handling missing values
-   Schema standardization
-   Basic data transformation

### Input

    Bronze tables / raw data

### Output

    Silver tables

------------------------------------------------------------------------

# Gold Layer

The Gold layer prepares datasets for **analytics and machine learning**.

------------------------------------------------------------------------

## `Gold_feature.py`

This script performs **feature engineering**.

### Example Features

-   Aggregation features
-   Time-based features
-   Statistical features
-   Derived columns

### Input

    Silver tables

### Output

    Gold feature dataset

------------------------------------------------------------------------

## `Gold_label.py`

This script generates **labels for model training**.

### Example Labels

-   Binary classification labels
-   Regression targets
-   Event-based labels

### Input

    Silver tables

### Output

    Gold label dataset

------------------------------------------------------------------------

## `Gold_merge.py`

This script merges **features and labels** to create the final dataset.

### Responsibilities

-   Join feature and label datasets
-   Align keys
-   Produce the final training dataset

### Input

    Gold_feature
    Gold_label

### Output

    Final training dataset

------------------------------------------------------------------------

# Pipeline Execution Order

The pipeline should be executed in the following order:

    1. Silver.py
    2. Gold_feature.py
    3. Gold_label.py
    4. Gold_merge.py

Pipeline flow:

    Bronze
      │
      ▼
    Silver
      │
      ├──► Gold_feature
      │
      └──► Gold_label
            │
            ▼
         Gold_merge
            │
            ▼
       Final Dataset

------------------------------------------------------------------------

# Output Tables

  Layer    Table          Description
  -------- -------------- -------------------------------
  Silver   silver\_\*     Cleaned and standardized data
  Gold     gold_feature   Feature dataset
  Gold     gold_label     Label dataset
  Gold     gold_merge     Final dataset for training

------------------------------------------------------------------------

# Tech Stack

-   Python
-   PySpark
-   Apache Spark
-   Delta Lake

------------------------------------------------------------------------

# Notes

-   Gold layer scripts depend on outputs from the Silver layer.
-   The pipeline is designed to be easily extendable for additional
    features or labels.

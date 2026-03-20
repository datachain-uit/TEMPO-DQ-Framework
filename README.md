## Overview
This repository provides resources for developing a comprehensive baseline for data processing on the MoocCubeX dataset.

The original MoocCubeX dataset can be accessed at:  
https://github.com/THU-KEG/MOOCCubeX
## Repository Structure

```
|-- src/
|   |-- data/                        # Main datasets used in the paper (e.g., MOOCCubeX)
|       |-- LO/                      # Experimental scripts and notebooks (Learning Objects)
|           |-- baseline_model/      # Implementation and checkpoints of baseline models
|           |-- dataset/
|           |-- process/            /# Processed data splits specific to these experiments
|       |-- CQ/                      # Experimental scripts and notebooks (Course Quality)   
|           |-- dataset/             
|           |-- process/
            # Data preprocessing scripts and intermediate logs
|   |-- website_demo/                # Source code for web application
|       |-- frontend/                # Client-side code 
|       |-- backend/                 # Server-side code
|-- README.md                        # Project documentation and setup guide
```

## Contents
### 1. src

- **data/**: Contains the **MOOCCubeX** dataset and task-specific experimental resources, including detailed entities (learners, courses, concepts) and attributes (e.g., `course_field`, `user_course_num_comments`).
    - **LO/ (Learning Objects)**: Experimental scripts and notebooks focused on Learning Objects.
        - `baseline_model/`: Implementation and checkpoints for the baseline models.
        - `dataset/`: Processed data splits specifically tailored for LO experiments.
        - `process/`: Data preprocessing scripts and intermediate logs for LO tasks.
    - **CQ/ (Course Quality)**: Experimental scripts and notebooks focused on evaluating course quality.
        - `baseline_model/`: Models and training checkpoints for CQ evaluation.
        - `dataset/`: Processed datasets and metadata specifically curated for quality analysis.
        - `process/`: Data preprocessing scripts and intermediate logs for CQ tasks.

- **website_demo/**: Source code for the **EduPath** simulated web application.
    - **frontend/**: Built with **React** and **CoreUI**, providing an intuitive interface for educational administrators to visualize learner/course analytics and personalized recommendations.
    - **backend/**: Built with **Django** and **Django REST Framework**, providing RESTful APIs for learner/course data, recommendation engines, and dashboard metrics.

---
### 2. Documentation

- **README.md**: Comprehensive project documentation, environment setup guide, and usage instructions for the MoocCubeX baseline.
## Workflow
The following diagram illustrates the workflow of baseline:
![TEMPO-DQ](https://github.com/user-attachments/assets/b90c028c-cbf6-48d9-88f8-1364ec9dd0b4)

The TEMPO-DQ pipeline is designed as a standardized end-to-end operational guide for preparing and governing heterogeneous big data within a unified data-preparation logic for DL-based early prediction. Rather than treating structured, semi-structured, and unstructured data as separate preprocessing streams, the framework integrates them into a coherent workflow that supports **Early Multi-Class Prediction under Heterogeneous Big Data**. As illustrated in this figure, this pipeline begins with **(1) Problem Scoping** to define prediction objectives, operational constraints, and evaluation criteria, then proceeds through **(2) Multi-Source Ingestion** and **(3) Early-Aware Data Preparation** to transform heterogeneous raw inputs into temporally consistent, model-ready representations. This design ensures that data preparation is not reduced to isolated technical steps, but is operationalized as a reproducible and deployable process aligned with the requirements of early inference.

Within this standardized workflow, TEMPO-DQ further embeds **(4) Automated DQ Measurement**, **(5) Adaptive DQ Intervention**, **(6) Temporal DL Modeling**, and continuous monitoring into the same end-to-end logic. Conventional DQ dimensions are first assessed to identify baseline issues in heterogeneous data assets, after which targeted interventions are applied to correct, enrich, and stabilize the prepared inputs. The workflow then extends DQ measurement toward advanced, performance-linked dimensions that reflect real model behavior during early multi-class prediction. By coupling heterogeneous data preparation with adaptive DQ governance and temporal modeling, TEMPO-DQ functions as a general DQF that bridges large-scale data processing and deployment-oriented AI operation. In this way, the pipeline provides a practical and standardized mechanism for operationalizing heterogeneous data, diagnosing quality-related risks, and sustaining reliable early prediction performance over time.

## Getting Started

## Usage



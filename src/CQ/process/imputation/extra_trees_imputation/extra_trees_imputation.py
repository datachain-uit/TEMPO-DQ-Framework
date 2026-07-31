# Extra-Trees iterative imputation of missing engagement features
#
# Fills missing values in the course-engagement feature table using an
# IterativeImputer driven by an ExtraTrees regressor (MICE-style imputation):
# each feature with missing entries is regressed on the remaining features and
# refined over several passes.

import pandas as pd
from sklearn.experimental import enable_iterative_imputer  # noqa: F401  (enables IterativeImputer)
from sklearn.impute import IterativeImputer
from sklearn.ensemble import ExtraTreesRegressor

# =============================================================================
# CONFIG
# =============================================================================

# Reproducibility seed for the imputer.
RANDOM_STATE = 42

# Columns excluded from imputation (identifiers / labels kept verbatim).
EXCLUDE_COLS = ["user_id", "course_id", "label_3"]

# Extra-Trees / IterativeImputer hyper-parameters. Kept intentionally light
# (single tree, shallow depth, one pass) for a fast, deterministic run.
N_ESTIMATORS = 1
MAX_DEPTH = 5
MAX_ITER = 1

# Input feature table and output (imputed) table.
INPUT_PATH = "../input/course_features.csv"
OUTPUT_PATH = "course_features_et.csv"


# =============================================================================
# HELPERS
# =============================================================================

def report_non_numeric_columns(df, name="dataframe"):
    """List columns that are not numeric (and would block numeric imputation)."""
    string_columns = [
        c for c in df.columns
        if not pd.api.types.is_numeric_dtype(df[c].dtype)
    ]
    print(f"Non-numeric columns in {name}:")
    if not string_columns:
        print("  none -- all columns are numeric.")
    else:
        for c in string_columns:
            print(f"  '{c}': {df[c].dtype}")
    return string_columns


def impute_dataframe(df, numeric_cols, imputer):
    """Impute ``numeric_cols`` in ``df`` with the Extra-Trees imputer (in place)."""
    if not df[numeric_cols].isnull().any().any():
        print("No missing values in numeric columns -- nothing to impute.")
        return df

    print("Running Extra-Trees imputation...")
    df[numeric_cols] = imputer.fit_transform(df[numeric_cols])
    print("Imputation complete.")
    return df


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    # TODO: point this to the labeled feature table to be imputed.
    df = pd.read_csv(INPUT_PATH)
    print(f"Loaded {len(df):,} rows x {df.shape[1]} columns")

    # Sanity check: categorical identifiers/labels are excluded from the numeric imputer.
    report_non_numeric_columns(df, "df")

    # Numeric feature columns eligible for imputation (everything numeric that is
    # not an explicitly excluded identifier/label).
    numeric_cols = [
        c for c in df.columns
        if pd.api.types.is_numeric_dtype(df[c].dtype) and c not in EXCLUDE_COLS
    ]
    print(f"Numeric columns selected for imputation: {len(numeric_cols)}")

    # MICE-style imputer driven by an Extra-Trees regressor.
    imputer = IterativeImputer(
        estimator=ExtraTreesRegressor(n_estimators=N_ESTIMATORS, max_depth=MAX_DEPTH),
        max_iter=MAX_ITER,
        sample_posterior=False,
        random_state=RANDOM_STATE,
    )

    df = impute_dataframe(df, numeric_cols, imputer)

    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved imputed table -> {OUTPUT_PATH} ({len(df):,} rows)")

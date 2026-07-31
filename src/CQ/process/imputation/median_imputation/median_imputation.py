# Median imputation of missing engagement features
#
# Fills missing values in the course-engagement feature table by replacing
# each missing numeric entry with that column's median, computed over the
# non-missing rows of the same table.

import pandas as pd

# =============================================================================
# CONFIG
# =============================================================================

# Columns excluded from imputation (identifiers / labels kept verbatim).
EXCLUDE_COLS = ["user_id", "course_id", "label"]

# Input feature table and output (imputed) table.
INPUT_PATH = "../input/course_features.csv"
OUTPUT_PATH = "course_features_median.csv"


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


def impute_dataframe(df, numeric_cols):
    """Impute ``numeric_cols`` in ``df`` with per-column medians (in place)."""
    if not df[numeric_cols].isnull().any().any():
        print("No missing values in numeric columns -- nothing to impute.")
        return df

    print("Running median imputation...")
    medians = df[numeric_cols].median()
    df[numeric_cols] = df[numeric_cols].fillna(medians)
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

    df = impute_dataframe(df, numeric_cols)

    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved imputed table -> {OUTPUT_PATH} ({len(df):,} rows)")

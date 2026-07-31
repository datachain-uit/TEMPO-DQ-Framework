"""CD-SMOTE (Cluster-based Decomposition SMOTE) class-imbalance augmentation
(TEMPO-DQ Framework).

For every minority class, the class is first decomposed into ``k`` clusters
via K-Means. Synthetic samples are then interpolated between two distinct
members of the same cluster, so that the geometry of each local sub-region is
preserved instead of blending across the whole minority class. Each minority
class is grown until it matches the majority count, with the number of
synthetic samples generated per cluster proportional to the cluster's share
of the minority class.

Reference (per minority class ``c``):
    n_gen = max_c' |X^(c')| - |X^(c)|
    {C_1, ..., C_k} = KMeans(X^(c), k)
    n_gen_k = round(n_gen * |C_k| / |X^(c)|)
    x_a, x_b ~ Uniform(C_k), x_a != x_b
    alpha ~ Uniform[0, 1]
    x_syn = x_a + alpha * (x_b - x_a)
"""

import numpy as np
from sklearn.cluster import KMeans

# =============================================================================
# CONFIG
# =============================================================================

# Number of clusters used to decompose each minority class.
N_CLUSTERS = 5

# Seed for every random operation (clustering + sample selection + interpolation).
RANDOM_STATE = 42


# =============================================================================
# CD-SMOTE
# =============================================================================

class CDSmote:
    """Oversample minority classes by interpolating within K-Means clusters.

    Parameters
    ----------
    n_clusters : int
        Number of clusters to decompose each minority class into. Automatically
        reduced when the minority class is too small to support this many
        clusters.
    random_state : int
        Seed controlling clustering, sample selection and interpolation
        coefficients.
    """

    def __init__(self, n_clusters=N_CLUSTERS, random_state=RANDOM_STATE):
        self.n_clusters = n_clusters
        self.random_state = random_state

    def fit_resample(self, X, y):
        """Return ``(X_res, y_res)`` with every minority class grown to the
        majority count. The original samples are preserved; only synthetic
        minority samples are appended.
        """
        rng = np.random.default_rng(self.random_state)
        X = np.asarray(X, dtype=np.float64)
        y = np.asarray(y)

        classes, counts = np.unique(y, return_counts=True)
        majority_count = counts.max()
        majority_class = classes[counts.argmax()]

        X_res, y_res = [X], [y]

        for cls in classes:
            if cls == majority_class:
                continue

            X_min = X[y == cls]
            n_to_gen = majority_count - len(X_min)
            if n_to_gen <= 0:
                continue

            # Decompose the minority class into local clusters (K-Means).
            n_clus = min(self.n_clusters, max(1, len(X_min) // 2))
            km = KMeans(n_clusters=n_clus, random_state=self.random_state, n_init=10)
            labels = km.fit_predict(X_min)

            X_syn = []
            for c in range(n_clus):
                X_c = X_min[labels == c]
                if len(X_c) < 2:
                    continue

                n_c = max(1, int(round(n_to_gen * len(X_c) / len(X_min))))
                idx_a = rng.integers(0, len(X_c), size=n_c)
                idx_b = rng.integers(0, len(X_c), size=n_c)
                same = idx_a == idx_b
                idx_b[same] = (idx_b[same] + 1) % len(X_c)

                alpha = rng.random(n_c)
                X_syn.append(X_c[idx_a] + alpha[:, None] * (X_c[idx_b] - X_c[idx_a]))

            if not X_syn:
                continue

            X_syn = np.vstack(X_syn)[:n_to_gen]
            X_res.append(X_syn)
            y_res.append(np.full(len(X_syn), cls))

            print(f'  Class "{cls}": {len(X_min):,} -> {len(X_min) + len(X_syn):,} '
                  f"(+{len(X_syn):,} synthetic)")

        return np.vstack(X_res), np.concatenate(y_res)


# =============================================================================
# EXAMPLE
# =============================================================================

if __name__ == "__main__":
    # Minimal usage example on a synthetic imbalanced dataset.
    rng = np.random.default_rng(RANDOM_STATE)
    X = np.vstack([
        rng.normal(0.0, 1.0, size=(100, 5)),  # majority class
        rng.normal(3.0, 1.0, size=(20, 5)),   # minority class
    ])
    y = np.array(["majority"] * 100 + ["minority"] * 20)

    smote = CDSmote(n_clusters=N_CLUSTERS, random_state=RANDOM_STATE)
    X_res, y_res = smote.fit_resample(X, y)

    print(f"Before: {len(y):,} samples -> After: {len(y_res):,} samples")

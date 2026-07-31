"""DL phase-based baseline models (TEMPO-DQ Framework, Course Quality track).

Single-file port of ``baseline-final-v2.ipynb``: one dataset class, four
single-branch RNN-family classifiers (LSTM, GRU, RNN, BiLSTM), one cumulative
phase-based training loop and one result-saving routine, driven by a plain
CONFIG section instead of hard-coded Kaggle/Colab paths.

Phase-based cumulative training: phase ``k`` retrains a fresh model on
``concat(train_1..k)`` and evaluates it on ``concat(test_1..k)``, simulating
data arriving incrementally over the course.
"""

import os
import time

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.cuda.amp as amp
from torch.utils.data import DataLoader, Dataset
from sklearn.metrics import classification_report, confusion_matrix

# =============================================================================
# CONFIG
# =============================================================================

# Directory holding one subfolder per phase, each with train.csv/val.csv/test.csv.
DATA_DIR = "data"  # TODO: point this to the phase-split, imputed+augmented dataset.
STAGE_DIRS = ["stage_1", "stage_2", "stage_3", "stage_4"]
LABEL_COL = "label_3"
LABEL_MAPPING = {"excellent": 0, "good": 1, "average": 2}

OUTPUT_BASE_DIR = "phase_results"

# Training hyper-parameters (shared by all 4 models).
NUM_EPOCHS = 50
BATCH_SIZE = 256
LR = 0.001
NUM_WORKERS = 4
NUM_CLASSES = 3

# Per-model hyper-parameters.
MODEL_HIDDEN_SIZES = {
    "LSTM": 128,
    "GRU": 128,
    "RNN": 256,
    "BiLSTM": 256,
}

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# =============================================================================
# DATASET
# =============================================================================

class Final_Dataset_Deep(Dataset):
    def __init__(self, df):
        df = df.copy().drop_duplicates()

        if df[LABEL_COL].dtype == "object":
            df[LABEL_COL] = df[LABEL_COL].map(LABEL_MAPPING)

        for col in df.columns:
            if col != LABEL_COL:
                df[col] = pd.to_numeric(df[col], errors="coerce")
        df = df.fillna(0)

        y = df[LABEL_COL].values.astype(np.int64)
        X = df.drop(columns=[LABEL_COL]).values.astype(np.float32)

        self.x = torch.tensor(X).unsqueeze(1)  # (N, 1, F)
        self.y = torch.tensor(y)
        self.num_features = self.x.shape[2]

    def __len__(self):
        return self.x.shape[0]

    def __getitem__(self, idx):
        return self.x[idx], self.y[idx]


# =============================================================================
# MODELS
# =============================================================================

class SimpleLSTM(nn.Module):
    def __init__(self, input_size=None, hidden_size=128, num_layers=1, num_classes=3):
        super().__init__()
        self.lstm = nn.LSTM(input_size=input_size, hidden_size=hidden_size,
                             num_layers=num_layers, batch_first=True)
        self.dropout = nn.Dropout(0.5)
        self.fc = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        out, _ = self.lstm(x)     # (batch, seq, hidden)
        out = out[:, -1, :]       # last timestep
        out = self.fc(out)        # (batch, num_classes)
        return out


class SimpleGRU(nn.Module):
    def __init__(self, input_size=None, hidden_size=128, num_layers=1, num_classes=3):
        super().__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.gru = nn.GRU(input_size, hidden_size, num_layers, batch_first=True)
        self.dropout = nn.Dropout(0.5)
        self.fc = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        out, _ = self.gru(x, h0)  # (batch, seq_len, hidden_size)
        out = out[:, -1, :]
        out = self.fc(out)
        return out


class SimpleRNN(nn.Module):
    def __init__(self, input_size=None, hidden_size=256, num_layers=1, num_classes=3):
        super().__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.rnn = nn.RNN(input_size, hidden_size, num_layers, batch_first=True, nonlinearity="tanh")
        self.dropout = nn.Dropout(0.5)
        self.fc1 = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size, device=x.device)
        out, _ = self.rnn(x, h0)  # (batch, seq_len, hidden_size)
        out = out[:, -1, :]       # last timestep
        out = self.fc1(out)       # (batch, num_classes)
        return out


class BiLSTM(nn.Module):
    def __init__(self, input_size=None, hidden_size=256, num_layers=1, num_classes=3):
        super().__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.lstm = nn.LSTM(input_size, hidden_size, num_layers,
                             batch_first=True, bidirectional=True)
        self.dropout = nn.Dropout(0.5)
        self.fc1 = nn.Linear(hidden_size * 2, num_classes)  # x2 for bidirectional

    def forward(self, x):
        batch_size = x.size(0)
        h0 = torch.zeros(self.num_layers * 2, batch_size, self.hidden_size, device=x.device)
        c0 = torch.zeros(self.num_layers * 2, batch_size, self.hidden_size, device=x.device)

        out, _ = self.lstm(x, (h0, c0))  # (batch, seq_len, hidden_size*2)
        out = out[:, -1, :]              # last timestep

        out = self.dropout(out)
        out = self.fc1(out)              # (batch, num_classes)
        return out


# =============================================================================
# PHASE-BASED TRAINING
# =============================================================================

def train_phase_model(
    model_class,
    model_kwargs,
    train_phase_dfs,
    val_phase_dfs,
    test_phase_dfs,
    num_epochs=NUM_EPOCHS,
    batch_size=BATCH_SIZE,
    lr=LR,
    device=DEVICE,
    num_workers=NUM_WORKERS,
):
    """Cumulative phase-based training.

    Phase k:
      - Train : concat(train_phase_dfs[0..k])
      - Val   : concat(val_phase_dfs[0..k])
      - Test  : concat(test_phase_dfs[0..k])
    """
    total_start = time.time()
    all_phase_results = []
    cumulative_train_df = cumulative_val_df = cumulative_test_df = None

    for phase_idx in range(len(train_phase_dfs)):
        phase_num = phase_idx + 1
        print(f"\n{'='*60}\nPHASE {phase_num}/{len(train_phase_dfs)}\n{'='*60}")

        cumulative_train_df = (
            train_phase_dfs[phase_idx].copy() if cumulative_train_df is None
            else pd.concat([cumulative_train_df, train_phase_dfs[phase_idx]], ignore_index=True)
        )
        cumulative_val_df = (
            val_phase_dfs[phase_idx].copy() if cumulative_val_df is None
            else pd.concat([cumulative_val_df, val_phase_dfs[phase_idx]], ignore_index=True)
        )
        cumulative_test_df = (
            test_phase_dfs[phase_idx].copy() if cumulative_test_df is None
            else pd.concat([cumulative_test_df, test_phase_dfs[phase_idx]], ignore_index=True)
        )

        print(f"  Train size : {len(cumulative_train_df):,}")
        print(f"  Val   size : {len(cumulative_val_df):,}")
        print(f"  Test  size : {len(cumulative_test_df):,}")

        train_labels = cumulative_train_df[LABEL_COL]
        if train_labels.dtype == "object":
            train_labels = train_labels.map(LABEL_MAPPING)
        train_labels = train_labels.values.astype(int)
        class_counts = np.bincount(train_labels, minlength=NUM_CLASSES)
        class_weights = 1.0 / np.maximum(class_counts, 1)
        class_weights = class_weights / class_weights.sum() * len(class_weights)
        criterion = nn.CrossEntropyLoss(
            weight=torch.tensor(class_weights, dtype=torch.float32).to(device)
        )
        print(f"  Class weights: {class_weights.round(4)}")

        train_ds = Final_Dataset_Deep(cumulative_train_df)
        val_ds = Final_Dataset_Deep(cumulative_val_df)
        test_ds = Final_Dataset_Deep(cumulative_test_df)

        persist = num_workers > 0
        train_ldr = DataLoader(train_ds, batch_size=batch_size, shuffle=True,
                                num_workers=num_workers, pin_memory=True, persistent_workers=persist)
        val_ldr = DataLoader(val_ds, batch_size=batch_size, shuffle=False,
                              num_workers=num_workers, pin_memory=True, persistent_workers=persist)
        test_ldr = DataLoader(test_ds, batch_size=batch_size, shuffle=False,
                               num_workers=num_workers, pin_memory=True, persistent_workers=persist)

        model = model_class(input_size=train_ds.num_features, **model_kwargs).to(device)
        try:
            compiled_model = torch.compile(model, mode="reduce-overhead")
            with torch.no_grad():
                dummy = torch.zeros(1, 1, train_ds.num_features, device=device)
                compiled_model(dummy)  # trigger compilation now, not mid-training
            model = compiled_model
            print("  Compile: ON")
        except Exception as e:
            print(f"  Compile: SKIP - {e}")

        optimizer = torch.optim.Adam(model.parameters(), lr=lr)

        phase_train_start = time.time()
        val_acc, val_loss = 0.0, 0.0
        for epoch in range(num_epochs):
            model.train()
            total_loss, total_correct = 0, 0

            for batch_X, batch_y in train_ldr:
                batch_X, batch_y = batch_X.to(device), batch_y.to(device)
                optimizer.zero_grad()
                with amp.autocast(dtype=torch.bfloat16):
                    outputs = model(batch_X)
                    loss = criterion(outputs.float(), batch_y)
                loss.backward()
                optimizer.step()

                total_loss += loss.item() * batch_X.size(0)
                total_correct += (outputs.detach().float().argmax(1) == batch_y).sum().item()

            if (epoch + 1) % 10 == 0 or epoch == num_epochs - 1:
                tr_loss = total_loss / len(train_ldr.dataset)
                tr_acc = total_correct / len(train_ldr.dataset)

                model.eval()
                val_loss, val_correct = 0, 0
                with torch.no_grad(), amp.autocast(dtype=torch.bfloat16):
                    for batch_X, batch_y in val_ldr:
                        batch_X, batch_y = batch_X.to(device), batch_y.to(device)
                        outputs = model(batch_X)
                        loss_v = criterion(outputs.float(), batch_y)
                        val_loss += loss_v.item() * batch_X.size(0)
                        val_correct += (outputs.float().argmax(1) == batch_y).sum().item()
                val_loss /= len(val_ldr.dataset)
                val_acc = val_correct / len(val_ldr.dataset)
                model.train()

                print(f"  Epoch {epoch+1:>3}/{num_epochs} | Loss: {tr_loss:.4f} | Acc: {tr_acc:.4f} "
                      f"| Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.4f}")

        phase_train_time = time.time() - phase_train_start
        print(f"  Train time : {phase_train_time:.2f}s")

        model.eval()
        print(f"\n  === Test (test_1..{phase_num} combined) | Phase {phase_num} ===")
        t_start = time.time()
        y_pred, y_true, all_probs = [], [], []
        test_correct = 0

        with torch.no_grad(), amp.autocast(dtype=torch.bfloat16):
            for batch_X, batch_y in test_ldr:
                batch_X, batch_y = batch_X.to(device), batch_y.to(device)
                outputs = model(batch_X)
                preds = torch.argmax(outputs.float(), dim=1)
                probs = torch.softmax(outputs.float(), dim=1)

                y_pred.extend(preds.cpu().numpy())
                y_true.extend(batch_y.cpu().numpy())
                all_probs.extend(probs.cpu().numpy())
                test_correct += (preds == batch_y).sum().item()

        t_time = time.time() - t_start
        t_acc = test_correct / len(test_ldr.dataset)
        cm = confusion_matrix(y_true, y_pred)

        print(f"  Accuracy: {t_acc:.4f}")
        print(classification_report(y_true, y_pred))

        all_phase_results.append({
            "phase": phase_num,
            "train_size": len(cumulative_train_df),
            "val_size": len(cumulative_val_df),
            "test_size": len(cumulative_test_df),
            "train_time": phase_train_time,
            "test_time": t_time,
            "accuracy": t_acc,
            "val_acc_last": val_acc,
            "val_loss_last": val_loss,
            "y_pred": list(y_pred),
            "y_true": list(y_true),
            "confusion_matrix": cm.tolist(),
            "probs": [list(p) for p in all_probs],
        })

    total_time = time.time() - total_start
    print(f"\n[Total time: {total_time:.2f}s]")
    return all_phase_results, total_time


# =============================================================================
# SAVE RESULTS
# =============================================================================

def save_phase_results(all_phase_results, output_dir):
    """Save phase-based training results to CSV.

    Directory layout::

        {output_dir}/
          summary.csv               -- accuracy, train_size, test_size per phase
          time_per_phase.csv        -- train/test time per phase
          phase{k}_predictions.csv
          phase{k}_confusion_matrix.csv
          phase{k}_probs.csv
    """
    os.makedirs(output_dir, exist_ok=True)
    summary_rows = []
    time_rows = []

    for res in all_phase_results:
        phase_num = res["phase"]
        tag = f"phase{phase_num}"

        y_true = np.array(res["y_true"])
        y_pred = np.array(res["y_pred"])
        cm = np.array(res["confusion_matrix"])
        probs = np.array(res["probs"])

        pd.DataFrame({"y_true": y_true, "y_pred": y_pred}).to_csv(
            f"{output_dir}/{tag}_predictions.csv", index=False)

        pd.DataFrame(cm).to_csv(
            f"{output_dir}/{tag}_confusion_matrix.csv", index=False)

        pd.DataFrame(
            probs,
            columns=[f"class_{i}_prob" for i in range(probs.shape[1])]
        ).to_csv(f"{output_dir}/{tag}_probs.csv", index=False)

        summary_rows.append({
            "phase": phase_num,
            "train_size": res["train_size"],
            "test_size": res["test_size"],
            "accuracy": res["accuracy"],
            "train_time_s": res["train_time"],
            "test_time_s": res["test_time"],
        })

        time_rows.append({
            "phase": phase_num,
            "train_size": res["train_size"],
            "train_time_s": res["train_time"],
            "test_size": res["test_size"],
            "test_time_s": res["test_time"],
            "total_phase_time_s": res["train_time"] + res["test_time"],
        })

    pd.DataFrame(summary_rows).to_csv(f"{output_dir}/summary.csv", index=False)
    pd.DataFrame(time_rows).to_csv(f"{output_dir}/time_per_phase.csv", index=False)
    print(f"Results saved to: {output_dir}/")


# =============================================================================
# MAIN — run phase-based training for all 4 models
# =============================================================================

if __name__ == "__main__":
    train_phase_dfs = [pd.read_csv(os.path.join(DATA_DIR, s, "train.csv")) for s in STAGE_DIRS]
    val_phase_dfs = [pd.read_csv(os.path.join(DATA_DIR, s, "val.csv")) for s in STAGE_DIRS]
    test_phase_dfs = [pd.read_csv(os.path.join(DATA_DIR, s, "test.csv")) for s in STAGE_DIRS]

    for i in range(len(STAGE_DIRS)):
        print(f"Phase {i+1}: train={len(train_phase_dfs[i]):,}, "
              f"val={len(val_phase_dfs[i]):,}, test={len(test_phase_dfs[i]):,}")

    MODEL_CLASSES = {
        "LSTM": SimpleLSTM,
        "GRU": SimpleGRU,
        "RNN": SimpleRNN,
        "BiLSTM": BiLSTM,
    }

    for model_name, model_class in MODEL_CLASSES.items():
        print(f"\n{'#'*20} {model_name} {'#'*20}")
        results, total_time = train_phase_model(
            model_class=model_class,
            model_kwargs=dict(hidden_size=MODEL_HIDDEN_SIZES[model_name], num_classes=NUM_CLASSES),
            train_phase_dfs=train_phase_dfs,
            val_phase_dfs=val_phase_dfs,
            test_phase_dfs=test_phase_dfs,
        )
        save_phase_results(results, output_dir=os.path.join(OUTPUT_BASE_DIR, model_name.lower()))

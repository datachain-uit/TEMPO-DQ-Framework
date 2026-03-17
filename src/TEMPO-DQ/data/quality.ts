export const DQ_DATA = {
  headerStats: [
    { label: "Dataset", value: "MOOCCubeX", subtext: "Online learning source" },
    { label: "Number of rows", value: "2,324,524", subtext: "Total records" },
    { label: "Number of columns", value: "181", subtext: "Available features" },
  ],

  theory: [
    {
      title: "Completeness",
      description:
        "Measures the percentage of fields that contain values vs. missing data. Essential for ensuring your dataset has enough information for analysis.",
    },
    {
      title: "Consistency",
      description:
        "Evaluates whether data follows defined rules and constraints. Ensures logical validity across your dataset (e.g., values within expected ranges).",
    },
  ],

  barChart: [
    { name: "Completeness", value: 16.09 },
    { name: "Consistency", value: 60.3 },
  ],

  donutCharts: [
    {
      title: "Completeness Rate",
      percent: 16.09,
      label: "Valid",
      data: [
        { label: "Complete", value: 16.09, fill: "#4ade80" },
        { label: "Missing", value: 83.91, fill: "#3f3f46" },
      ],
    },
    {
      title: "Consistency Rate",
      percent: 60.3,
      label: "Stable",
      data: [
        { label: "Consistent", value: 60.3, fill: "#fbbf24" },
        { label: "Outliers", value: 39.7, fill: "#3f3f46" },
      ],
    },
  ],

  diagnostic: {
    // phase 4 (GRU model V0)
    score: 31.84,
    status: "Poor",

    radarData: [
      { subject: "MacroF1", A: 77.2, fullMark: 100 },
      { subject: "Bal-Acc", A: 84.2, fullMark: 100 },
      { subject: "MCC (Norm)", A: 83.7, fullMark: 100 }, // Normalized: (0.673 + 1) / 2
      { subject: "Kappa (Norm)", A: 83.1, fullMark: 100 }, // Normalized: (0.662 + 1) / 2
      { subject: "S-Sanity", A: 7.7, fullMark: 100 }, // S_san+ = 0.077
    ],

    aiMessages: [
      {
        type: "success",
        title: "Numerical Stability (snan = 1.0)",
        content:
          "No NaN/Inf errors or Softmax normalization issues detected. The preprocessing pipeline ensures mathematical stability during training.",
      },
      {
        type: "error",
        title: "Severe Mode Collapse (smaj = 0.3%)",
        content:
          "Extremely low smaj indicates the model is heavily biased toward the majority class (Label 0), failing to distinguish minority patterns.",
      },
      {
        type: "warning",
        title: "Missingness Signal Leakage (sleak = 2.8%)",
        content:
          "Strong leakage detected from missing data patterns. The model is likely learning 'shortcuts' from the absence of data rather than actual behavioral features.",
      },
      {
        type: "warning",
        title: "Low Prediction Entropy (sent = 0.22%)",
        content:
          "The model is overconfident in its biased predictions, showing a lack of uncertainty even when classifying complex edge cases.",
      },
    ],

    footerIndicators: [
      { label: "Performance (Sperf)", val: "82.01%", color: "text-green-400" },
      { label: "Sanity (Ssan+)", val: "7.70%", color: "text-red-400" },
      { label: "Completeness", val: "16.09%", color: "text-red-400" },
      { label: "Drift (sdrift)", val: "99.99%", color: "text-red-400" },
    ],
  },
};

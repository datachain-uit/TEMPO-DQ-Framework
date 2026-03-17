export const METRICS = ["Accuracy", "BalancedAcc", "F1-Score Macro", "MCC", "Kappa"];

export const VERSIONS = [
  { id: "V0", label: "V0 (Raw Median)" },
  { id: "V1", label: "V1 (Median CDSMOTE)" },
  { id: "V2", label: "V2 (Median SASMOTE)" },
  { id: "V3", label: "V3 (Median RADIUSSMOTE)" },
  { id: "V4", label: "V4 (Tree CDSMOTE)" },
  { id: "V5", label: "V5 (Tree SASMOTE)" },
  { id: "V6", label: "V6 (Tree RADIUSSMOTE)" },
];

export const EXPERIMENT_DATA: any = {
  V0: [
    { name: "LightGNB", Accuracy: 0.9970, BalancedAcc: 0.9265, F1Macro: 0.7659, MCC: 0.7026, Kappa: 0.6812 },
    { name: "Random Forest", Accuracy: 0.9987, BalancedAcc: 0.7975, F1Macro: 0.8509, MCC: 0.7913, Kappa: 0.7827 },
    { name: "RNN", Accuracy: 0.9967, BalancedAcc: 0.8237, F1Macro: 0.7521, MCC: 0.6501, Kappa: 0.6350 },
    { name: "LSTM", Accuracy: 0.9945, BalancedAcc: 0.6416, F1Macro: 0.5454, MCC: 0.5143, Kappa: 0.4833 },
    { name: "GRU", Accuracy: 0.9971, BalancedAcc: 0.8422, F1Macro: 0.7724, MCC: 0.6732, Kappa: 0.6619 },
    { name: "BiLSTM", Accuracy: 0.9971, BalancedAcc: 0.8279, F1Macro: 0.7647, MCC: 0.6735, Kappa: 0.6642 },
  ],

  V1: [
    { name: "LightGNB", Accuracy: 0.3950, BalancedAcc: 0.6729, F1Macro: 0.4184, MCC: 0.0508, Kappa: 0.0049 },
    { name: "Random Forest", Accuracy: 0.0028, BalancedAcc: 0.4193, F1Macro: 0.1298, MCC: 0.1047, Kappa: 0.0002 },
    { name: "RNN", Accuracy: 0.9970, BalancedAcc: 0.5287, F1Macro: 0.5976, MCC: 0.4557, Kappa: 0.4280 },
    { name: "LSTM", Accuracy: 0.1033, BalancedAcc: 0.4600, F1Macro: 0.1503, MCC: 0.0231, Kappa: 0.0009 },
    { name: "GRU", Accuracy: 0.9975, BalancedAcc: 0.6763, F1Macro: 0.7092, MCC: 0.6080, Kappa: 0.6041 },
    { name: "BiLSTM", Accuracy: 0.9977, BalancedAcc: 0.7240, F1Macro: 0.7512, MCC: 0.6538, Kappa: 0.6522 },
  ],

  V2: [
    { name: "LightGNB", Accuracy: 0.9965, BalancedAcc: 0.9413, F1Macro: 0.7658, MCC: 0.6828, Kappa: 0.6519 },
    { name: "Random Forest", Accuracy: 0.9936, BalancedAcc: 0.9360, F1Macro: 0.6865, MCC: 0.5744, Kappa: 0.5102 },
    { name: "RNN", Accuracy: 0.9931, BalancedAcc: 0.8747, F1Macro: 0.6421, MCC: 0.5354, Kappa: 0.4746 },
    { name: "LSTM", Accuracy: 0.9889, BalancedAcc: 0.9262, F1Macro: 0.5898, MCC: 0.4708, Kappa: 0.3758 },
    { name: "GRU", Accuracy: 0.9945, BalancedAcc: 0.8694, F1Macro: 0.6722, MCC: 0.5725, Kappa: 0.5259 },
    { name: "BiLSTM", Accuracy: 0.9953, BalancedAcc: 0.8777, F1Macro: 0.7034, MCC: 0.6032, Kappa: 0.5653 },
  ],

  V3: [
    { name: "LightGNB", Accuracy: 0.1229, BalancedAcc: 0.3722, F1Macro: 0.0754, MCC: 0.0183, Kappa: 0.0008 },
    { name: "Random Forest", Accuracy: 0.0264, BalancedAcc: 0.5012, F1Macro: 0.2147, MCC: 0.0320, Kappa: 0.0006 },
    { name: "RNN", Accuracy: 0.9920, BalancedAcc: 0.8374, F1Macro: 0.5895, MCC: 0.4971, Kappa: 0.4318 },
    { name: "LSTM", Accuracy: 0.9865, BalancedAcc: 0.8661, F1Macro: 0.5329, MCC: 0.4146, Kappa: 0.3170 },
    { name: "GRU", Accuracy: 0.9943, BalancedAcc: 0.8406, F1Macro: 0.6443, MCC: 0.5585, Kappa: 0.5137 },
    { name: "BiLSTM", Accuracy: 0.9955, BalancedAcc: 0.8430, F1Macro: 0.6825, MCC: 0.6003, Kappa: 0.5683 },
  ],

  V4: [
    { name: "LightGNB", Accuracy: 0.9965, BalancedAcc: 0.9354, F1Macro: 0.7609, MCC: 0.6844, Kappa: 0.6537 },
    { name: "Random Forest", Accuracy: 0.9947, BalancedAcc: 0.9366, F1Macro: 0.7146, MCC: 0.6134, Kappa: 0.5600 },
    { name: "RNN", Accuracy: 0.9900, BalancedAcc: 0.8967, F1Macro: 0.5744, MCC: 0.4756, Kappa: 0.3911 },
    { name: "LSTM", Accuracy: 0.9849, BalancedAcc: 0.8888, F1Macro: 0.5492, MCC: 0.4046, Kappa: 0.2991 },
    { name: "GRU", Accuracy: 0.9936, BalancedAcc: 0.9120, F1Macro: 0.6453, MCC: 0.5631, Kappa: 0.5031 },
    { name: "BiLSTM", Accuracy: 0.9940, BalancedAcc: 0.9073, F1Macro: 0.6573, MCC: 0.5744, Kappa: 0.5188 },
  ],

  V5: [
    { name: "LightGNB", Accuracy: 0.9965, BalancedAcc: 0.9425, F1Macro: 0.7644, MCC: 0.6855, Kappa: 0.6542 },
    { name: "Random Forest", Accuracy: 0.9948, BalancedAcc: 0.9386, F1Macro: 0.7163, MCC: 0.6167, Kappa: 0.5638 },
    { name: "RNN", Accuracy: 0.9913, BalancedAcc: 0.9014, F1Macro: 0.5912, MCC: 0.5015, Kappa: 0.4247 },
    { name: "LSTM", Accuracy: 0.9849, BalancedAcc: 0.9308, F1Macro: 0.5542, MCC: 0.4127, Kappa: 0.3037 },
    { name: "GRU", Accuracy: 0.9929, BalancedAcc: 0.9036, F1Macro: 0.6329, MCC: 0.5396, Kappa: 0.4747 },
    { name: "BiLSTM", Accuracy: 0.9942, BalancedAcc: 0.8960, F1Macro: 0.6479, MCC: 0.5761, Kappa: 0.5237 },
  ],

  V6: [
    { name: "LightGNB", Accuracy: 0.0512, BalancedAcc: 0.3511, F1Macro: 0.0334, MCC: 0.0116, Kappa: 0.0003 },
    { name: "Random Forest", Accuracy: 0.0696, BalancedAcc: 0.5246, F1Macro: 0.2455, MCC: 0.0292, Kappa: 0.0009 },
    { name: "RNN", Accuracy: 0.9907, BalancedAcc: 0.8554, F1Macro: 0.5681, MCC: 0.4728, Kappa: 0.3975 },
    { name: "LSTM", Accuracy: 0.9649, BalancedAcc: 0.8198, F1Macro: 0.4241, MCC: 0.2558, Kappa: 0.1422 },
    { name: "GRU", Accuracy: 0.9929, BalancedAcc: 0.8770, F1Macro: 0.6278, MCC: 0.5337, Kappa: 0.4708 },
    { name: "BiLSTM", Accuracy: 0.9945, BalancedAcc: 0.8659, F1Macro: 0.6592, MCC: 0.5740, Kappa: 0.5289 },
  ],
};


export const PHASE_DATA: any = {
  V0: {
  Accuracy: [
    { name: "Phase 1", LightGNB: 0.9969, "Random Forest": 0.9965, RNN: 0.9964, LSTM: 0.9895, GRU: 0.9955, BiLSTM: 0.0031 },
    { name: "Phase 2", LightGNB: 0.9977, "Random Forest": 0.9972, RNN: 0.9964, LSTM: 0.9911, GRU: 0.9956, BiLSTM: 0.0061 },
    { name: "Phase 3", LightGNB: 0.9970, "Random Forest": 0.9981, RNN: 0.9963, LSTM: 0.9866, GRU: 0.9959, BiLSTM: 0.9941 },
    { name: "Phase 4", LightGNB: 0.9970, "Random Forest": 0.9987, RNN: 0.9967, LSTM: 0.9945, GRU: 0.9971, BiLSTM: 0.9971 },
  ],

  BalancedAcc: [
    { name: "Phase 1", LightGNB: 0.4462, "Random Forest": 0.3492, RNN: 0.3333, LSTM: 0.4019, GRU: 0.4508, BiLSTM: 0.3335 },
    { name: "Phase 2", LightGNB: 0.6208, "Random Forest": 0.4737, RNN: 0.3333, LSTM: 0.4294, GRU: 0.5775, BiLSTM: 0.3323 },
    { name: "Phase 3", LightGNB: 0.8485, "Random Forest": 0.6902, RNN: 0.3388, LSTM: 0.4768, GRU: 0.7654, BiLSTM: 0.6818 },
    { name: "Phase 4", LightGNB: 0.9265, "Random Forest": 0.7975, RNN: 0.8237, LSTM: 0.6416, GRU: 0.8422, BiLSTM: 0.8279 },
  ],

  "F1-Score Macro": [
    { name: "Phase 1", LightGNB: 0.5155, "Random Forest": 0.3631, RNN: 0.3327, LSTM: 0.3653, GRU: 0.4687, BiLSTM: 0.0021 },
    { name: "Phase 2", LightGNB: 0.7084, "Random Forest": 0.5623, RNN: 0.3327, LSTM: 0.3837, GRU: 0.5646, BiLSTM: 0.0041 },
    { name: "Phase 3", LightGNB: 0.7377, "Random Forest": 0.7812, RNN: 0.3429, LSTM: 0.3814, GRU: 0.6830, BiLSTM: 0.5972 },
    { name: "Phase 4", LightGNB: 0.7659, "Random Forest": 0.8509, RNN: 0.7521, LSTM: 0.5454, GRU: 0.7724, BiLSTM: 0.7647 },
  ],

  MCC: [
    { name: "Phase 1", LightGNB: 0.3941, "Random Forest": 0.1773, RNN: 0.0000, LSTM: 0.1251, GRU: 0.2892, BiLSTM: 0.0012 },
    { name: "Phase 2", LightGNB: 0.6047, "Random Forest": 0.4543, RNN: 0.0000, LSTM: 0.1877, GRU: 0.4118, BiLSTM: -0.0017 },
    { name: "Phase 3", LightGNB: 0.6502, "Random Forest": 0.6909, RNN: 0.0499, LSTM: 0.2067, GRU: 0.5582, BiLSTM: 0.4988 },
    { name: "Phase 4", LightGNB: 0.7026, "Random Forest": 0.7913, RNN: 0.6501, LSTM: 0.5143, GRU: 0.6732, BiLSTM: 0.6735 },
  ],

  Kappa: [
    { name: "Phase 1", LightGNB: 0.3191, "Random Forest": 0.0651, RNN: 0.0000, LSTM: 0.1143, GRU: 0.2865, BiLSTM: 0.0000 },
    { name: "Phase 2", LightGNB: 0.5765, "Random Forest": 0.3520, RNN: 0.0000, LSTM: 0.1762, GRU: 0.4114, BiLSTM: 0.0000 },
    { name: "Phase 3", LightGNB: 0.6433, "Random Forest": 0.6603, RNN: 0.0235, LSTM: 0.1707, GRU: 0.5451, BiLSTM: 0.4651 },
    { name: "Phase 4", LightGNB: 0.6812, "Random Forest": 0.7827, RNN: 0.6350, LSTM: 0.4833, GRU: 0.6619, BiLSTM: 0.6642 },
  ],
},
  V1: {
  Accuracy: [
    { name: "Phase 1", LightGNB: 0.9891, "Random Forest": 0.0026, RNN: 0.0163, LSTM: 0.2106, GRU: 0.6406, BiLSTM: 0.1972 },
    { name: "Phase 2", LightGNB: 0.9649, "Random Forest": 0.0026, RNN: 0.8080, LSTM: 0.1564, GRU: 0.8968, BiLSTM: 0.0071 },
    { name: "Phase 3", LightGNB: 0.6935, "Random Forest": 0.0027, RNN: 0.9965, LSTM: 0.1815, GRU: 0.9954, BiLSTM: 0.8506 },
    { name: "Phase 4", LightGNB: 0.3950, "Random Forest": 0.0028, RNN: 0.9970, LSTM: 0.1033, GRU: 0.9975, BiLSTM: 0.9977 },
  ],

  BalancedAcc: [
    { name: "Phase 1", LightGNB: 0.3743, "Random Forest": 0.3333, RNN: 0.3368, LSTM: 0.4894, GRU: 0.3981, BiLSTM: 0.3654 },
    { name: "Phase 2", LightGNB: 0.5410, "Random Forest": 0.3333, RNN: 0.5000, LSTM: 0.4835, GRU: 0.5344, BiLSTM: 0.3558 },
    { name: "Phase 3", LightGNB: 0.7115, "Random Forest": 0.3632, RNN: 0.4394, LSTM: 0.4840, GRU: 0.6476, BiLSTM: 0.6196 },
    { name: "Phase 4", LightGNB: 0.6729, "Random Forest": 0.4193, RNN: 0.5287, LSTM: 0.4600, GRU: 0.6763, BiLSTM: 0.7240 },
  ],

  "F1-Score Macro": [
    { name: "Phase 1", LightGNB: 0.3527, "Random Forest": 0.0017, RNN: 0.0108, LSTM: 0.1446, GRU: 0.3237, BiLSTM: 0.1117 },
    { name: "Phase 2", LightGNB: 0.4105, "Random Forest": 0.0017, RNN: 0.3041, LSTM: 0.1245, GRU: 0.4143, BiLSTM: 0.0479 },
    { name: "Phase 3", LightGNB: 0.4899, "Random Forest": 0.0555, RNN: 0.4662, LSTM: 0.1633, GRU: 0.6193, BiLSTM: 0.3795 },
    { name: "Phase 4", LightGNB: 0.4184, "Random Forest": 0.1298, RNN: 0.5976, LSTM: 0.1503, GRU: 0.7092, BiLSTM: 0.7512 },
  ],

  MCC: [
    { name: "Phase 1", LightGNB: 0.0699, "Random Forest": 0.0000, RNN: 0.0045, LSTM: 0.0287, GRU: 0.0164, BiLSTM: 0.0107 },
    { name: "Phase 2", LightGNB: 0.1546, "Random Forest": 0.0000, RNN: 0.0674, LSTM: 0.0261, GRU: 0.0767, BiLSTM: -0.0289 },
    { name: "Phase 3", LightGNB: 0.0719, "Random Forest": 0.0698, RNN: 0.3774, LSTM: 0.0279, GRU: 0.4811, BiLSTM: 0.0837 },
    { name: "Phase 4", LightGNB: 0.0508, "Random Forest": 0.1047, RNN: 0.4557, LSTM: 0.0231, GRU: 0.6080, BiLSTM: 0.6538 },
  ],

  Kappa: [
    { name: "Phase 1", LightGNB: 0.0643, "Random Forest": 0.0000, RNN: 0.0001, LSTM: 0.0018, GRU: 0.0026, BiLSTM: 0.0008 },
    { name: "Phase 2", LightGNB: 0.0881, "Random Forest": 0.0000, RNN: 0.0162, LSTM: 0.0014, GRU: 0.0262, BiLSTM: -0.0003 },
    { name: "Phase 3", LightGNB: 0.0128, "Random Forest": 0.0001, RNN: 0.3580, LSTM: 0.0016, GRU: 0.4729, BiLSTM: 0.0234 },
    { name: "Phase 4", LightGNB: 0.0049, "Random Forest": 0.0002, RNN: 0.4280, LSTM: 0.0009, GRU: 0.6041, BiLSTM: 0.6522 },
  ],
},
  V2: {
  Accuracy: [
    { name: "Phase 1", LightGNB: 0.9961, "Random Forest": 0.0077, RNN: 0.9937, LSTM: 0.2899, GRU: 0.9957, BiLSTM: 0.0026 },
    { name: "Phase 2", LightGNB: 0.9968, "Random Forest": 0.0254, RNN: 0.0079, LSTM: 0.6705, GRU: 0.9949, BiLSTM: 0.0026 },
    { name: "Phase 3", LightGNB: 0.9968, "Random Forest": 0.7276, RNN: 0.0095, LSTM: 0.6814, GRU: 0.0119, BiLSTM: 0.0030 },
    { name: "Phase 4", LightGNB: 0.9965, "Random Forest": 0.9936, RNN: 0.9931, LSTM: 0.9889, GRU: 0.9945, BiLSTM: 0.9953 },
  ],

  BalancedAcc: [
    { name: "Phase 1", LightGNB: 0.4199, "Random Forest": 0.3285, RNN: 0.4725, LSTM: 0.6033, GRU: 0.4865, BiLSTM: 0.3333 },
    { name: "Phase 2", LightGNB: 0.5806, "Random Forest": 0.3347, RNN: 0.3632, LSTM: 0.7816, GRU: 0.6275, BiLSTM: 0.3408 },
    { name: "Phase 3", LightGNB: 0.8671, "Random Forest": 0.7816, RNN: 0.4798, LSTM: 0.8185, GRU: 0.4924, BiLSTM: 0.3485 },
    { name: "Phase 4", LightGNB: 0.9413, "Random Forest": 0.9360, RNN: 0.8747, LSTM: 0.9262, GRU: 0.8694, BiLSTM: 0.8777 },
  ],

  "F1-Score Macro": [
    { name: "Phase 1", LightGNB: 0.4604, "Random Forest": 0.0052, RNN: 0.4231, LSTM: 0.1633, GRU: 0.5044, BiLSTM: 0.0017 },
    { name: "Phase 2", LightGNB: 0.6136, "Random Forest": 0.0196, RNN: 0.1030, LSTM: 0.3170, GRU: 0.5749, BiLSTM: 0.0163 },
    { name: "Phase 3", LightGNB: 0.7381, "Random Forest": 0.3861, RNN: 0.1206, LSTM: 0.3283, GRU: 0.1476, BiLSTM: 0.0361 },
    { name: "Phase 4", LightGNB: 0.7658, "Random Forest": 0.6865, RNN: 0.6421, LSTM: 0.5898, GRU: 0.6722, BiLSTM: 0.7034 },
  ],

  MCC: [
    { name: "Phase 1", LightGNB: 0.2588, "Random Forest": -0.0082, RNN: 0.3050, LSTM: 0.0373, GRU: 0.3464, BiLSTM: 0.0000 },
    { name: "Phase 2", LightGNB: 0.5208, "Random Forest": 0.0014, RNN: 0.0704, LSTM: 0.0823, GRU: 0.4339, BiLSTM: 0.0309 },
    { name: "Phase 3", LightGNB: 0.6475, "Random Forest": 0.0903, RNN: 0.0982, LSTM: 0.0859, GRU: 0.0957, BiLSTM: 0.0087 },
    { name: "Phase 4", LightGNB: 0.6828, "Random Forest": 0.5744, RNN: 0.5354, LSTM: 0.4708, GRU: 0.5725, BiLSTM: 0.6032 },
  ],

  Kappa: [
    { name: "Phase 1", LightGNB: 0.2368, "Random Forest": -0.0001, RNN: 0.2979, LSTM: 0.0030, GRU: 0.3453, BiLSTM: 0.0000 },
    { name: "Phase 2", LightGNB: 0.5190, "Random Forest": 0.0000, RNN: 0.0010, LSTM: 0.0139, GRU: 0.4246, BiLSTM: 0.0000 },
    { name: "Phase 3", LightGNB: 0.6343, "Random Forest": 0.0174, RNN: 0.0013, LSTM: 0.0149, GRU: 0.0014, BiLSTM: 0.0000 },
    { name: "Phase 4", LightGNB: 0.6519, "Random Forest": 0.5102, RNN: 0.4746, LSTM: 0.3758, GRU: 0.5259, BiLSTM: 0.5653 },
  ],
},
  V3: {
  Accuracy: [
    { name: "Phase 1", LightGNB: 0.0223, "Random Forest": 0.0026, RNN: 0.0026, LSTM: 0.3355, GRU: 0.9942, BiLSTM: 0.9923 },
    { name: "Phase 2", LightGNB: 0.0272, "Random Forest": 0.0026, RNN: 0.0025, LSTM: 0.4351, GRU: 0.0105, BiLSTM: 0.0054 },
    { name: "Phase 3", LightGNB: 0.0243, "Random Forest": 0.0029, RNN: 0.0070, LSTM: 0.8805, GRU: 0.0111, BiLSTM: 0.0072 },
    { name: "Phase 4", LightGNB: 0.1229, "Random Forest": 0.0264, RNN: 0.9920, LSTM: 0.9865, GRU: 0.9943, BiLSTM: 0.9955 },
  ],
  BalancedAcc: [
    { name: "Phase 1", LightGNB: 0.3752, "Random Forest": 0.3333, RNN: 0.3624, LSTM: 0.5819, GRU: 0.4507, BiLSTM: 0.4753 },
    { name: "Phase 2", LightGNB: 0.3514, "Random Forest": 0.3403, RNN: 0.3470, LSTM: 0.6391, GRU: 0.3141, BiLSTM: 0.3630 },
    { name: "Phase 3", LightGNB: 0.3443, "Random Forest": 0.4352, RNN: 0.5072, LSTM: 0.8048, GRU: 0.4089, BiLSTM: 0.4019 },
    { name: "Phase 4", LightGNB: 0.3722, "Random Forest": 0.5012, RNN: 0.8374, LSTM: 0.8661, GRU: 0.8406, BiLSTM: 0.8430 },
  ],
  "F1-Score Macro": [
    { name: "Phase 1", LightGNB: 0.0153, "Random Forest": 0.0017, RNN: 0.0621, LSTM: 0.1987, GRU: 0.4199, BiLSTM: 0.4146 },
    { name: "Phase 2", LightGNB: 0.0195, "Random Forest": 0.0163, RNN: 0.0479, LSTM: 0.2225, GRU: 0.0292, BiLSTM: 0.0429 },
    { name: "Phase 3", LightGNB: 0.0211, "Random Forest": 0.1366, RNN: 0.0863, LSTM: 0.4264, GRU: 0.1471, BiLSTM: 0.0688 },
    { name: "Phase 4", LightGNB: 0.0754, "Random Forest": 0.2147, RNN: 0.5895, LSTM: 0.5329, GRU: 0.6443, BiLSTM: 0.6825 },
  ],
  MCC: [
    { name: "Phase 1", LightGNB: -0.0037, "Random Forest": 0.0000, RNN: 0.0241, LSTM: 0.0411, GRU: 0.2715, BiLSTM: 0.2047 },
    { name: "Phase 2", LightGNB: 0.0057, "Random Forest": 0.0264, RNN: -0.0261, LSTM: 0.0496, GRU: -0.0475, BiLSTM: 0.0193 },
    { name: "Phase 3", LightGNB: 0.0077, "Random Forest": 0.0989, RNN: 0.0005, LSTM: 0.1437, GRU: 0.0886, BiLSTM: -0.0658 },
    { name: "Phase 4", LightGNB: 0.0183, "Random Forest": 0.0320, RNN: 0.4971, LSTM: 0.4146, GRU: 0.5585, BiLSTM: 0.6003 },
  ],
  Kappa: [
    { name: "Phase 1", LightGNB: -0.0002, "Random Forest": 0.0000, RNN: 0.0000, LSTM: 0.0035, GRU: 0.2698, BiLSTM: 0.1974 },
    { name: "Phase 2", LightGNB: 0.0002, "Random Forest": 0.0000, RNN: -0.0001, LSTM: 0.0053, GRU: -0.0005, BiLSTM: 0.0002 },
    { name: "Phase 3", LightGNB: 0.0002, "Random Forest": 0.0003, RNN: 0.0000, LSTM: 0.0449, GRU: 0.0013, BiLSTM: -0.0009 },
    { name: "Phase 4", LightGNB: 0.0008, "Random Forest": 0.0006, RNN: 0.4318, LSTM: 0.3170, GRU: 0.5137, BiLSTM: 0.5683 },
  ],
},
  V4: {
  Accuracy: [
    { name: "Phase 1", LightGNB: 0.9964, "Random Forest": 0.1788, RNN: 0.9964, LSTM: 0.0026, GRU: 0.9955, BiLSTM: 0.9964 },
    { name: "Phase 2", LightGNB: 0.9964, "Random Forest": 0.4152, RNN: 0.9964, LSTM: 0.0032, GRU: 0.9940, BiLSTM: 0.9964 },
    { name: "Phase 3", LightGNB: 0.9970, "Random Forest": 0.6117, RNN: 0.9904, LSTM: 0.0545, GRU: 0.9911, BiLSTM: 0.9966 },
    { name: "Phase 4", LightGNB: 0.9965, "Random Forest": 0.9947, RNN: 0.9900, LSTM: 0.9849, GRU: 0.9936, BiLSTM: 0.9940 },
  ],

  BalancedAcc: [
    { name: "Phase 1", LightGNB: 0.3333, "Random Forest": 0.3472, RNN: 0.3333, LSTM: 0.3333, GRU: 0.4725, BiLSTM: 0.3333 },
    { name: "Phase 2", LightGNB: 0.3366, "Random Forest": 0.4384, RNN: 0.3344, LSTM: 0.3330, GRU: 0.5605, BiLSTM: 0.3502 },
    { name: "Phase 3", LightGNB: 0.4904, "Random Forest": 0.5534, RNN: 0.6215, LSTM: 0.1248, GRU: 0.6527, BiLSTM: 0.4559 },
    { name: "Phase 4", LightGNB: 0.9354, "Random Forest": 0.9366, RNN: 0.8967, LSTM: 0.8888, GRU: 0.9120, BiLSTM: 0.9073 },
  ],

  "F1-Score Macro": [
    { name: "Phase 1", LightGNB: 0.3327, "Random Forest": 0.1021, RNN: 0.3327, LSTM: 0.0017, GRU: 0.4116, BiLSTM: 0.3327 },
    { name: "Phase 2", LightGNB: 0.3392, "Random Forest": 0.1979, RNN: 0.3349, LSTM: 0.0021, GRU: 0.4340, BiLSTM: 0.3637 },
    { name: "Phase 3", LightGNB: 0.5469, "Random Forest": 0.2861, RNN: 0.4816, LSTM: 0.0346, GRU: 0.4767, BiLSTM: 0.4966 },
    { name: "Phase 4", LightGNB: 0.7609, "Random Forest": 0.7146, RNN: 0.5744, LSTM: 0.5492, GRU: 0.6453, BiLSTM: 0.6573 },
  ],

  MCC: [
    { name: "Phase 1", LightGNB: -0.0004, "Random Forest": 0.0084, RNN: 0.0000, LSTM: 0.0000, GRU: 0.2655, BiLSTM: 0.0000 },
    { name: "Phase 2", LightGNB: 0.0575, "Random Forest": 0.0345, RNN: 0.0465, LSTM: -0.0017, GRU: 0.3040, BiLSTM: 0.1199 },
    { name: "Phase 3", LightGNB: 0.4641, "Random Forest": 0.0617, RNN: 0.3312, LSTM: -0.1447, GRU: 0.3081, BiLSTM: 0.3555 },
    { name: "Phase 4", LightGNB: 0.6844, "Random Forest": 0.6134, RNN: 0.4756, LSTM: 0.4046, GRU: 0.5631, BiLSTM: 0.5744 },
  ],

  Kappa: [
    { name: "Phase 1", LightGNB: -0.0001, "Random Forest": 0.0005, RNN: 0.0000, LSTM: 0.0000, GRU: 0.2611, BiLSTM: 0.0000 },
    { name: "Phase 2", LightGNB: 0.0142, "Random Forest": 0.0035, RNN: 0.0072, LSTM: 0.0000, GRU: 0.2993, BiLSTM: 0.0545 },
    { name: "Phase 3", LightGNB: 0.4333, "Random Forest": 0.0092, RNN: 0.2906, LSTM: -0.0042, GRU: 0.2784, BiLSTM: 0.3252 },
    { name: "Phase 4", LightGNB: 0.6537, "Random Forest": 0.5600, RNN: 0.3911, LSTM: 0.2991, GRU: 0.5031, BiLSTM: 0.5188 },
  ],
},
  V5: {
  Accuracy: [
    { name: "Phase 1", LightGNB: 0.9965, "Random Forest": 0.1192, RNN: 0.9964, LSTM: 0.8862, GRU: 0.9965, BiLSTM: 0.9964 },
    { name: "Phase 2", LightGNB: 0.9968, "Random Forest": 0.3304, RNN: 0.9840, LSTM: 0.8677, GRU: 0.9964, BiLSTM: 0.9965 },
    { name: "Phase 3", LightGNB: 0.9970, "Random Forest": 0.5636, RNN: 0.9900, LSTM: 0.9309, GRU: 0.9971, BiLSTM: 0.9957 },
    { name: "Phase 4", LightGNB: 0.9965, "Random Forest": 0.9948, RNN: 0.9913, LSTM: 0.9849, GRU: 0.9929, BiLSTM: 0.9942 },
  ],

  BalancedAcc: [
    { name: "Phase 1", LightGNB: 0.3477, "Random Forest": 0.3476, RNN: 0.3333, LSTM: 0.7884, GRU: 0.3752, BiLSTM: 0.3333 },
    { name: "Phase 2", LightGNB: 0.4082, "Random Forest": 0.4138, RNN: 0.4627, LSTM: 0.7872, GRU: 0.4619, BiLSTM: 0.3628 },
    { name: "Phase 3", LightGNB: 0.5249, "Random Forest": 0.5312, RNN: 0.6506, LSTM: 0.8209, GRU: 0.5689, BiLSTM: 0.4661 },
    { name: "Phase 4", LightGNB: 0.9425, "Random Forest": 0.9386, RNN: 0.9014, LSTM: 0.9308, GRU: 0.9036, BiLSTM: 0.8960 },
  ],

  "F1-Score Macro": [
    { name: "Phase 1", LightGNB: 0.3598, "Random Forest": 0.0718, RNN: 0.3327, LSTM: 0.3499, GRU: 0.3860, BiLSTM: 0.3327 },
    { name: "Phase 2", LightGNB: 0.4408, "Random Forest": 0.1674, RNN: 0.4079, LSTM: 0.3576, GRU: 0.4562, BiLSTM: 0.3827 },
    { name: "Phase 3", LightGNB: 0.5732, "Random Forest": 0.2591, RNN: 0.4930, LSTM: 0.4984, GRU: 0.6202, BiLSTM: 0.4995 },
    { name: "Phase 4", LightGNB: 0.7644, "Random Forest": 0.7163, RNN: 0.5912, LSTM: 0.5542, GRU: 0.6329, BiLSTM: 0.6479 },
  ],

  MCC: [
    { name: "Phase 1", LightGNB: 0.1767, "Random Forest": 0.0087, RNN: 0.0076, LSTM: 0.1322, GRU: 0.2022, BiLSTM: 0.0000 },
    { name: "Phase 2", LightGNB: 0.3652, "Random Forest": 0.0280, RNN: 0.1221, LSTM: 0.1337, GRU: 0.3121, BiLSTM: 0.1344 },
    { name: "Phase 3", LightGNB: 0.4887, "Random Forest": 0.0562, RNN: 0.3648, LSTM: 0.1954, GRU: 0.5014, BiLSTM: 0.3026 },
    { name: "Phase 4", LightGNB: 0.6855, "Random Forest": 0.6167, RNN: 0.5015, LSTM: 0.4127, GRU: 0.5396, BiLSTM: 0.5761 },
  ],

  Kappa: [
    { name: "Phase 1", LightGNB: 0.0714, "Random Forest": 0.0004, RNN: 0.0012, LSTM: 0.0428, GRU: 0.1376, BiLSTM: 0.0000 },
    { name: "Phase 2", LightGNB: 0.3029, "Random Forest": 0.0023, RNN: 0.0974, LSTM: 0.0397, GRU: 0.2854, BiLSTM: 0.0593 },
    { name: "Phase 3", LightGNB: 0.4745, "Random Forest": 0.0076, RNN: 0.3126, LSTM: 0.0802, GRU: 0.4790, BiLSTM: 0.2986 },
    { name: "Phase 4", LightGNB: 0.6542, "Random Forest": 0.5638, RNN: 0.4247, LSTM: 0.3037, GRU: 0.4747, BiLSTM: 0.5237 },
  ],
},
  V6: {
  Accuracy: [
    { name: "Phase 1", LightGNB: 0.0350, "Random Forest": 0.0026, RNN: 0.4057, LSTM: 0.0026, GRU: 0.9962, BiLSTM: 0.9865 },
    { name: "Phase 2", LightGNB: 0.0350, "Random Forest": 0.0026, RNN: 0.9437, LSTM: 0.0026, GRU: 0.9626, BiLSTM: 0.9843 },
    { name: "Phase 3", LightGNB: 0.0349, "Random Forest": 0.0039, RNN: 0.9940, LSTM: 0.0046, GRU: 0.9914, BiLSTM: 0.9921 },
    { name: "Phase 4", LightGNB: 0.0512, "Random Forest": 0.0696, RNN: 0.9907, LSTM: 0.9649, GRU: 0.9929, BiLSTM: 0.9945 },
  ],

  BalancedAcc: [
    { name: "Phase 1", LightGNB: 0.3442, "Random Forest": 0.3333, RNN: 0.3565, LSTM: 0.3333, GRU: 0.4289, BiLSTM: 0.4251 },
    { name: "Phase 2", LightGNB: 0.3442, "Random Forest": 0.3333, RNN: 0.5220, LSTM: 0.3333, GRU: 0.5270, BiLSTM: 0.4930 },
    { name: "Phase 3", LightGNB: 0.3535, "Random Forest": 0.3338, RNN: 0.6154, LSTM: 0.3313, GRU: 0.5767, BiLSTM: 0.5560 },
    { name: "Phase 4", LightGNB: 0.3511, "Random Forest": 0.5246, RNN: 0.8554, LSTM: 0.8198, GRU: 0.8770, BiLSTM: 0.8659 },
  ],

  "F1-Score Macro": [
    { name: "Phase 1", LightGNB: 0.0228, "Random Forest": 0.0017, RNN: 0.1964, LSTM: 0.0017, GRU: 0.4393, BiLSTM: 0.3658 },
    { name: "Phase 2", LightGNB: 0.0228, "Random Forest": 0.0017, RNN: 0.3517, LSTM: 0.0017, GRU: 0.3536, BiLSTM: 0.3787 },
    { name: "Phase 3", LightGNB: 0.0261, "Random Forest": 0.0026, RNN: 0.5385, LSTM: 0.0031, GRU: 0.4467, BiLSTM: 0.4616 },
    { name: "Phase 4", LightGNB: 0.0334, "Random Forest": 0.2455, RNN: 0.5681, LSTM: 0.4241, GRU: 0.6278, BiLSTM: 0.6592 },
  ],

  MCC: [
    { name: "Phase 1", LightGNB: 0.0095, "Random Forest": 0.0000, RNN: 0.0074, LSTM: 0.0000, GRU: 0.3460, BiLSTM: 0.1352 },
    { name: "Phase 2", LightGNB: 0.0092, "Random Forest": 0.0000, RNN: 0.1097, LSTM: 0.0000, GRU: 0.1610, BiLSTM: 0.2022 },
    { name: "Phase 3", LightGNB: 0.0038, "Random Forest": 0.0018, RNN: 0.3631, LSTM: -0.0062, GRU: 0.3857, BiLSTM: 0.3659 },
    { name: "Phase 4", LightGNB: 0.0116, "Random Forest": 0.0292, RNN: 0.4728, LSTM: 0.2558, GRU: 0.5337, BiLSTM: 0.5740 },
  ],

  Kappa: [
    { name: "Phase 1", LightGNB: 0.0002, "Random Forest": 0.0000, RNN: 0.0007, LSTM: 0.0000, GRU: 0.3339, BiLSTM: 0.1140 },
    { name: "Phase 2", LightGNB: 0.0002, "Random Forest": 0.0000, RNN: 0.0509, LSTM: 0.0000, GRU: 0.0890, BiLSTM: 0.1578 },
    { name: "Phase 3", LightGNB: 0.0001, "Random Forest": 0.0000, RNN: 0.3526, LSTM: 0.0000, GRU: 0.3427, BiLSTM: 0.3342 },
    { name: "Phase 4", LightGNB: 0.0003, "Random Forest": 0.0009, RNN: 0.3975, LSTM: 0.1422, GRU: 0.4708, BiLSTM: 0.5289 },
  ],
},
};

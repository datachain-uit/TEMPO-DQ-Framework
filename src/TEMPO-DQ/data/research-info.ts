interface OverviewCard {
  id: number;
  title: string;
  description: string;
}

export const OVERVIEW_DATA: OverviewCard[] = [
  {
    id: 1,
    title: "Algorithmic Core",
    description:
      "We implement advanced Deep Learning architectures, specifically LSTM, GRU, and BiLSTM models, to effectively process sequential time-series data and capture complex learning patterns.",
  },
  {
    id: 2,
    title: "Imbalance Handling",
    description:
      "To ensure fairness in prediction, we apply state-of-the-art resampling techniques like RadiusSMOTE and SASMOTE, solving the critical challenge of class imbalance in educational datasets.",
  },
  {
    id: 3,
    title: "Granular Prediction",
    description:
      "Moving beyond simple pass/fail binary outcomes, our system classifies student performance into specific tiers (Grades A through E), enabling highly targeted pedagogical strategies.",
  },
  {
    id: 4,
    title: "Behavioral Analytics",
    description:
      "Our model ingests multi-dimensional interaction data in real-time—spanning video engagement, assignment submission habits, and forum discussions—to construct a holistic learner profile.",
  },
];

export const MEMBERS_DATA = [
  {
    id: 1,
    name: "Nguyễn Anh Hải Ngọc",
    role: "LO-research",
  },
  {
    id: 2,
    name: "Thu Hương",
    role: "LO-research",
  },
  {
    id: 3,
    name: "Trần Kim Anh",
    role: "LO-research",
  },
  {
    id: 4,
    name: "Nguyễn Đức Minh Mẫn",
    role: "CQ-research",
  },
];
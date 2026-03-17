interface Member {
  id: number;
  name: string;
  studentId: string;
  classId: string;
  color?: string;
}

export const MEMBERS_DATA: Member[] = [
  {
    id: 1,
    name: "Trần Thị Kim Anh",
    studentId: "23520079",
    classId: "CNNB2023.1",
  },
  {
    id: 2,
    name: "Trần Thị Thu Hoài",
    studentId: "23520509",
    classId: "KTPM2023.1",
  },
  {
    id: 3,
    name: "Lại Thị Thu Hương",
    studentId: "23520585",
    classId: "CNNB2023.1",
  },
  {
    id: 4,
    name: "Phan Trần Văn Khang",
    studentId: "23520708",
    classId: "CNNB2023.1",
  },
  {
    id: 5,
    name: "Nguyễn Thế Luân",
    studentId: "23520899",
    classId: "KHMT2023.2",
  },
  {
    id: 6,
    name: "Phạm Ngọc Quang Minh",
    studentId: "23520947",
    classId: "KTPM2023.2",
  },
  {
    id: 7,
    name: "Lê Đăng Khoa",
    studentId: "23520740",
    classId: "CNNB2023.1",
  },
];

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

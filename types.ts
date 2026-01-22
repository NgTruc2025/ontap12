export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface UserInfo {
  name: string;      // Full name for display
  firstName: string; // Tên (cho Google Sheet)
  lastName: string;  // Họ đệm (cho Google Sheet)
  className: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  score: number; // Scale of 10
  timeSpent: string;
  date: string;
  isDisqualified?: boolean;
}

export enum QuizState {
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT'
}

export type AnswerMap = Record<string, string>; // questionId -> selectedAnswer
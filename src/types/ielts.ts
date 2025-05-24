// IELTS Reading Test Types and Interfaces

export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  type: 'academic' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
  topic: string;
  source?: string;
}

export interface Question {
  id: string;
  passageId: string;
  type: QuestionType;
  questionNumber: number;
  instruction: string;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

export type QuestionType = 
  | 'multiple-choice'
  | 'true-false-not-given'
  | 'yes-no-not-given'
  | 'matching-headings'
  | 'matching-information'
  | 'matching-features'
  | 'sentence-completion'
  | 'summary-completion'
  | 'short-answer'
  | 'diagram-labeling'
  | 'table-completion';

export interface TestSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  timeLimit: number; // in minutes
  isCompleted: boolean;
  isPaused: boolean;
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  passages: ReadingPassage[];
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  timeSpent: number; // in seconds
  isCorrect?: boolean;
}

export interface TestResult {
  sessionId: string;
  userId?: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // out of 40 for IELTS
  bandScore: number; // 1-9 band score
  timeSpent: number; // in minutes
  answers: UserAnswer[];
  completedAt: Date;
  feedback: TestFeedback;
}

export interface TestFeedback {
  overallPerformance: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detailedResults: {
    [questionType: string]: {
      attempted: number;
      correct: number;
      accuracy: number;
    };
  };
}

export interface TimerState {
  timeRemaining: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  hasStarted: boolean;
}

export interface NavigationState {
  currentPassage: number;
  currentQuestion: number;
  totalPassages: number;
  totalQuestions: number;
  visitedQuestions: Set<number>;
  flaggedQuestions: Set<number>;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  showInstructions: boolean;
  showResults: boolean;
  highlightedText: string | null;
  fontSize: 'small' | 'medium' | 'large';
}

// Band Score Calculation
export const BAND_SCORE_MAPPING = {
  academic: {
    39: 9.0, 38: 8.5, 37: 8.5, 36: 8.0, 35: 8.0,
    34: 7.5, 33: 7.5, 32: 7.0, 31: 7.0, 30: 6.5,
    29: 6.5, 28: 6.0, 27: 6.0, 26: 5.5, 25: 5.5,
    24: 5.0, 23: 5.0, 22: 4.5, 21: 4.5, 20: 4.0,
    19: 4.0, 18: 3.5, 17: 3.5, 16: 3.0, 15: 3.0
  },
  general: {
    40: 9.0, 39: 8.5, 38: 8.0, 37: 8.0, 36: 7.5,
    35: 7.5, 34: 7.0, 33: 7.0, 32: 6.5, 31: 6.5,
    30: 6.0, 29: 6.0, 28: 5.5, 27: 5.5, 26: 5.0,
    25: 5.0, 24: 4.5, 23: 4.5, 22: 4.0, 21: 4.0,
    20: 3.5, 19: 3.5, 18: 3.0, 17: 3.0, 16: 2.5
  }
};

export const QUESTION_TIME_LIMITS = {
  'multiple-choice': 90, // seconds
  'true-false-not-given': 60,
  'yes-no-not-given': 60,
  'matching-headings': 120,
  'matching-information': 90,
  'matching-features': 90,
  'sentence-completion': 75,
  'summary-completion': 90,
  'short-answer': 60,
  'diagram-labeling': 75,
  'table-completion': 90
};

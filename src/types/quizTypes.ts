// Quiz System Types

export type QuestionType = 'multiple-choice' | 'true-false' | 'scenario';

export type QuizMode = 'practice' | 'test' | 'mock-checkride' | 'quick';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionCategory = 
  | 'objective' 
  | 'teaching-point' 
  | 'error' 
  | 'standard' 
  | 'scenario'
  | 'procedure';

export interface QuizQuestion {
  id: string;
  lessonId: string;
  lessonTitle: string;
  areaCode: string;
  
  // Question content
  type: QuestionType;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  
  question: string;
  options: string[];        // 4 options for MC, 2 for T/F
  correctIndex: number;     // Index of correct answer (0-3)
  
  // Learning content
  explanation: string;
  acsReference: string;     // e.g., "Area IV, Task B"
  teachingTip?: string;
  relatedTopics?: string[];
  
  // Statistics
  timesAsked: number;
  timesCorrect: number;
  timesWrong: number;
  averageTimeToAnswer: number; // seconds
  
  // Metadata
  tags: string[];
  createdAt: number;
  lastAsked: number;
}

export interface Quiz {
  id: string;
  name: string;
  description: string;
  
  // Content
  lessonIds: string[];
  questionIds: string[];
  
  // Settings
  mode: QuizMode;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  timeLimit?: number;       // minutes (0 = no limit)
  passingScore: number;     // percentage (default 80%)
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showExplanations: boolean;
  
  // Metadata
  isOfficial: boolean;      // Auto-generated vs custom
  createdAt: number;
  updatedAt: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpent: number;        // seconds
  timestamp: number;
}

export interface QuizSession {
  id: string;
  quizId: string;
  quizName: string;
  mode: QuizMode;
  
  // Timing
  startTime: number;
  endTime?: number;
  timeLimit?: number;
  
  // Answers
  answers: QuizAnswer[];
  currentQuestionIndex: number;
  
  // Results
  score: number;            // 0-100
  totalQuestions: number;
  correctAnswers: number;
  totalTimeSpent: number;   // seconds
  
  // Analysis
  weakAreas: Array<{
    category: string;
    lessonId?: string;
    lessonTitle?: string;
    accuracy: number;
    questionCount: number;
  }>;
  
  // Status
  isComplete: boolean;
  passed: boolean;
}

export interface QuizStats {
  // Overall
  totalQuizzes: number;
  totalQuestionsAnswered: number;
  averageScore: number;
  passRate: number;
  totalTimeSpent: number;   // seconds
  
  // Performance
  perfectScores: number;    // 100%
  ninetyPlus: number;       // 90-99%
  eightyPlus: number;       // 80-89%
  
  // By mode
  practiceQuizzes: number;
  testQuizzes: number;
  mockCheckrides: number;
  mockCheckridePassed: number;
  
  // Areas
  masteredLessons: string[];   // 90%+ accuracy
  weakLessons: string[];       // < 70% accuracy
  
  // Streaks
  currentStreak: number;       // Consecutive passing quizzes
  longestStreak: number;
  
  // Recent
  lastQuizDate: number;
  lastQuizScore: number;
}

export interface QuestionBank {
  totalQuestions: number;
  questionsByLesson: Record<string, number>;
  questionsByArea: Record<string, number>;
  questionsByDifficulty: Record<QuestionDifficulty, number>;
  questionsByType: Record<QuestionType, number>;
}







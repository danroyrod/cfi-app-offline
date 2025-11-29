// Quiz Service - Core quiz logic and management

import type { 
  QuizQuestion, 
  Quiz, 
  QuizSession, 
  QuizStats, 
  QuizAnswer,
  QuestionBank 
} from '../types/quizTypes';

class QuizService {
  private readonly QUESTIONS_KEY = 'quiz-questions';
  private readonly QUIZZES_KEY = 'quizzes';
  private readonly SESSIONS_KEY = 'quiz-sessions';
  private readonly CURRENT_SESSION_KEY = 'current-quiz-session';

  // ==================== QUESTIONS ====================

  /**
   * Get all questions
   */
  getAllQuestions(): QuizQuestion[] {
    const stored = localStorage.getItem(this.QUESTIONS_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Get a specific question
   */
  getQuestion(id: string): QuizQuestion | null {
    const questions = this.getAllQuestions();
    return questions.find(q => q.id === id) || null;
  }

  /**
   * Get questions for a lesson
   */
  getLessonQuestions(lessonId: string): QuizQuestion[] {
    return this.getAllQuestions().filter(q => q.lessonId === lessonId);
  }

  /**
   * Get questions for an area
   */
  getAreaQuestions(areaCode: string): QuizQuestion[] {
    return this.getAllQuestions().filter(q => q.areaCode === areaCode);
  }

  /**
   * Create a question
   */
  createQuestion(question: Omit<QuizQuestion, 'id' | 'timesAsked' | 'timesCorrect' | 'timesWrong' | 'averageTimeToAnswer' | 'createdAt' | 'lastAsked'>): QuizQuestion {
    const questions = this.getAllQuestions();
    
    const newQuestion: QuizQuestion = {
      ...question,
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timesAsked: 0,
      timesCorrect: 0,
      timesWrong: 0,
      averageTimeToAnswer: 0,
      createdAt: Date.now(),
      lastAsked: 0
    };

    questions.push(newQuestion);
    this.saveQuestions(questions);
    return newQuestion;
  }

  /**
   * Update a question
   */
  updateQuestion(id: string, updates: Partial<QuizQuestion>): boolean {
    const questions = this.getAllQuestions();
    const index = questions.findIndex(q => q.id === id);
    
    if (index === -1) return false;
    
    questions[index] = {
      ...questions[index],
      ...updates
    };
    
    this.saveQuestions(questions);
    return true;
  }

  /**
   * Delete a question
   */
  deleteQuestion(id: string): boolean {
    const questions = this.getAllQuestions();
    const filtered = questions.filter(q => q.id !== id);
    
    if (filtered.length === questions.length) return false;
    
    this.saveQuestions(filtered);
    return true;
  }

  /**
   * Save questions to storage
   */
  private saveQuestions(questions: QuizQuestion[]): void {
    localStorage.setItem(this.QUESTIONS_KEY, JSON.stringify(questions));
  }

  /**
   * Update question statistics after being answered
   */
  updateQuestionStats(questionId: string, isCorrect: boolean, timeSpent: number): void {
    const question = this.getQuestion(questionId);
    if (!question) return;

    const newTimesAsked = question.timesAsked + 1;
    const newTimesCorrect = question.timesCorrect + (isCorrect ? 1 : 0);
    const newTimesWrong = question.timesWrong + (isCorrect ? 0 : 1);
    const newAverageTime = 
      (question.averageTimeToAnswer * question.timesAsked + timeSpent) / newTimesAsked;

    this.updateQuestion(questionId, {
      timesAsked: newTimesAsked,
      timesCorrect: newTimesCorrect,
      timesWrong: newTimesWrong,
      averageTimeToAnswer: newAverageTime,
      lastAsked: Date.now()
    });
  }

  // ==================== QUIZZES ====================

  /**
   * Get all quizzes
   */
  getAllQuizzes(): Quiz[] {
    const stored = localStorage.getItem(this.QUIZZES_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Get a specific quiz
   */
  getQuiz(id: string): Quiz | null {
    const quizzes = this.getAllQuizzes();
    return quizzes.find(q => q.id === id) || null;
  }

  /**
   * Create a quiz
   */
  createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Quiz {
    const quizzes = this.getAllQuizzes();
    
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    quizzes.push(newQuiz);
    localStorage.setItem(this.QUIZZES_KEY, JSON.stringify(quizzes));
    return newQuiz;
  }

  /**
   * Update a quiz
   */
  updateQuiz(id: string, updates: Partial<Quiz>): boolean {
    const quizzes = this.getAllQuizzes();
    const index = quizzes.findIndex(q => q.id === id);
    
    if (index === -1) return false;
    
    quizzes[index] = {
      ...quizzes[index],
      ...updates,
      updatedAt: Date.now()
    };
    
    localStorage.setItem(this.QUIZZES_KEY, JSON.stringify(quizzes));
    return true;
  }

  /**
   * Delete a quiz
   */
  deleteQuiz(id: string): boolean {
    const quizzes = this.getAllQuizzes();
    const filtered = quizzes.filter(q => q.id !== id);
    
    if (filtered.length === quizzes.length) return false;
    
    localStorage.setItem(this.QUIZZES_KEY, JSON.stringify(filtered));
    return true;
  }

  // ==================== SESSIONS ====================

  /**
   * Start a quiz session
   */
  startSession(quiz: Quiz): QuizSession {
    const session: QuizSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quizId: quiz.id,
      quizName: quiz.name,
      mode: quiz.mode,
      startTime: Date.now(),
      timeLimit: quiz.timeLimit,
      answers: [],
      currentQuestionIndex: 0,
      score: 0,
      totalQuestions: quiz.questionIds.length,
      correctAnswers: 0,
      totalTimeSpent: 0,
      weakAreas: [],
      isComplete: false,
      passed: false
    };

    // Save as current session
    localStorage.setItem(this.CURRENT_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  /**
   * Get current session
   */
  getCurrentSession(): QuizSession | null {
    const stored = localStorage.getItem(this.CURRENT_SESSION_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  /**
   * Update current session
   */
  updateCurrentSession(updates: Partial<QuizSession>): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    const updated = { ...session, ...updates };
    localStorage.setItem(this.CURRENT_SESSION_KEY, JSON.stringify(updated));
    return true;
  }

  /**
   * Submit an answer
   */
  submitAnswer(questionId: string, selectedIndex: number, timeSpent: number): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    const question = this.getQuestion(questionId);
    if (!question) return false;

    const isCorrect = selectedIndex === question.correctIndex;

    // Create answer record
    const answer: QuizAnswer = {
      questionId,
      selectedIndex,
      isCorrect,
      timeSpent,
      timestamp: Date.now()
    };

    // Update session
    session.answers.push(answer);
    session.currentQuestionIndex++;
    session.correctAnswers += isCorrect ? 1 : 0;
    session.totalTimeSpent += timeSpent;

    // Update question statistics
    this.updateQuestionStats(questionId, isCorrect, timeSpent);

    // Save session
    localStorage.setItem(this.CURRENT_SESSION_KEY, JSON.stringify(session));
    
    return true;
  }

  /**
   * Complete a quiz session
   */
  completeSession(): QuizSession | null {
    const session = this.getCurrentSession();
    if (!session) return null;

    // Calculate final score
    const score = session.totalQuestions > 0 
      ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
      : 0;

    const quiz = this.getQuiz(session.quizId);
    const passingScore = quiz?.passingScore || 80;
    const passed = score >= passingScore;

    // Identify weak areas
    const weakAreas = this.identifyWeakAreas(session);

    // Update session
    const completedSession: QuizSession = {
      ...session,
      endTime: Date.now(),
      score,
      weakAreas,
      isComplete: true,
      passed
    };

    // Save to history
    const sessions = this.getAllSessions();
    sessions.push(completedSession);
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));

    // Clear current session
    localStorage.removeItem(this.CURRENT_SESSION_KEY);

    return completedSession;
  }

  /**
   * Identify weak areas from session
   */
  private identifyWeakAreas(session: QuizSession): QuizSession['weakAreas'] {
    const categoryStats = new Map<string, { correct: number; total: number; lessonId?: string; lessonTitle?: string }>();

    session.answers.forEach(answer => {
      const question = this.getQuestion(answer.questionId);
      if (!question) return;

      const key = `${question.category}-${question.lessonId}`;
      const existing = categoryStats.get(key) || { 
        correct: 0, 
        total: 0,
        lessonId: question.lessonId,
        lessonTitle: question.lessonTitle
      };

      existing.total++;
      if (answer.isCorrect) existing.correct++;

      categoryStats.set(key, existing);
    });

    // Find areas with < 70% accuracy
    const weakAreas: QuizSession['weakAreas'] = [];
    categoryStats.forEach((stats, key) => {
      const accuracy = (stats.correct / stats.total) * 100;
      if (accuracy < 70) {
        const category = key.split('-')[0];
        weakAreas.push({
          category,
          lessonId: stats.lessonId,
          lessonTitle: stats.lessonTitle,
          accuracy,
          questionCount: stats.total
        });
      }
    });

    return weakAreas;
  }

  /**
   * Get all sessions
   */
  getAllSessions(): QuizSession[] {
    const stored = localStorage.getItem(this.SESSIONS_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Get recent sessions
   */
  getRecentSessions(limit: number = 10): QuizSession[] {
    return this.getAllSessions()
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, limit);
  }

  /**
   * Delete a session
   */
  deleteSession(id: string): boolean {
    const sessions = this.getAllSessions();
    const filtered = sessions.filter(s => s.id !== id);
    
    if (filtered.length === sessions.length) return false;
    
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(filtered));
    return true;
  }

  // ==================== STATISTICS ====================

  /**
   * Get overall statistics
   */
  getStats(): QuizStats {
    const sessions = this.getAllSessions();
    const completedSessions = sessions.filter(s => s.isComplete);

    if (completedSessions.length === 0) {
      return {
        totalQuizzes: 0,
        totalQuestionsAnswered: 0,
        averageScore: 0,
        passRate: 0,
        totalTimeSpent: 0,
        perfectScores: 0,
        ninetyPlus: 0,
        eightyPlus: 0,
        practiceQuizzes: 0,
        testQuizzes: 0,
        mockCheckrides: 0,
        mockCheckridePassed: 0,
        masteredLessons: [],
        weakLessons: [],
        currentStreak: 0,
        longestStreak: 0,
        lastQuizDate: 0,
        lastQuizScore: 0
      };
    }

    // Calculate stats
    const totalQuizzes = completedSessions.length;
    const totalQuestionsAnswered = completedSessions.reduce((sum, s) => sum + s.totalQuestions, 0);
    const averageScore = completedSessions.reduce((sum, s) => sum + s.score, 0) / totalQuizzes;
    const passedQuizzes = completedSessions.filter(s => s.passed).length;
    const passRate = (passedQuizzes / totalQuizzes) * 100;
    const totalTimeSpent = completedSessions.reduce((sum, s) => sum + s.totalTimeSpent, 0);

    const perfectScores = completedSessions.filter(s => s.score === 100).length;
    const ninetyPlus = completedSessions.filter(s => s.score >= 90).length;
    const eightyPlus = completedSessions.filter(s => s.score >= 80).length;

    const practiceQuizzes = completedSessions.filter(s => s.mode === 'practice').length;
    const testQuizzes = completedSessions.filter(s => s.mode === 'test').length;
    const mockCheckrides = completedSessions.filter(s => s.mode === 'mock-checkride').length;
    const mockCheckridePassed = completedSessions.filter(s => s.mode === 'mock-checkride' && s.passed).length;

    // Identify mastered and weak lessons
    const lessonPerformance = this.calculateLessonPerformance();
    const masteredLessons = lessonPerformance
      .filter(lp => lp.accuracy >= 90)
      .map(lp => lp.lessonId);
    const weakLessons = lessonPerformance
      .filter(lp => lp.accuracy < 70)
      .map(lp => lp.lessonId);

    // Calculate streaks
    const { currentStreak, longestStreak } = this.calculateStreaks();

    const lastSession = completedSessions[completedSessions.length - 1];

    return {
      totalQuizzes,
      totalQuestionsAnswered,
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate),
      totalTimeSpent,
      perfectScores,
      ninetyPlus,
      eightyPlus,
      practiceQuizzes,
      testQuizzes,
      mockCheckrides,
      mockCheckridePassed,
      masteredLessons,
      weakLessons,
      currentStreak,
      longestStreak,
      lastQuizDate: lastSession.startTime,
      lastQuizScore: lastSession.score
    };
  }

  /**
   * Calculate performance per lesson
   */
  private calculateLessonPerformance(): Array<{ lessonId: string; accuracy: number; count: number }> {
    const sessions = this.getAllSessions().filter(s => s.isComplete);
    const lessonStats = new Map<string, { correct: number; total: number }>();

    sessions.forEach(session => {
      session.answers.forEach(answer => {
        const question = this.getQuestion(answer.questionId);
        if (!question) return;

        const stats = lessonStats.get(question.lessonId) || { correct: 0, total: 0 };
        stats.total++;
        if (answer.isCorrect) stats.correct++;
        lessonStats.set(question.lessonId, stats);
      });
    });

    const performance: Array<{ lessonId: string; accuracy: number; count: number }> = [];
    lessonStats.forEach((stats, lessonId) => {
      performance.push({
        lessonId,
        accuracy: (stats.correct / stats.total) * 100,
        count: stats.total
      });
    });

    return performance;
  }

  /**
   * Calculate quiz streaks
   */
  private calculateStreaks(): { currentStreak: number; longestStreak: number } {
    const sessions = this.getAllSessions()
      .filter(s => s.isComplete)
      .sort((a, b) => a.startTime - b.startTime);

    if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Count from most recent backwards
    for (let i = sessions.length - 1; i >= 0; i--) {
      if (sessions[i].passed) {
        tempStreak++;
        if (i === sessions.length - 1) {
          currentStreak = tempStreak;
        }
      } else {
        if (i === sessions.length - 1) {
          currentStreak = 0;
        }
        tempStreak = 0;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return { currentStreak, longestStreak };
  }

  /**
   * Get question bank info
   */
  getQuestionBank(): QuestionBank {
    const questions = this.getAllQuestions();

    const questionsByLesson: Record<string, number> = {};
    const questionsByArea: Record<string, number> = {};
    const questionsByDifficulty: Record<string, number> = {};
    const questionsByType: Record<string, number> = {};

    questions.forEach(q => {
      questionsByLesson[q.lessonId] = (questionsByLesson[q.lessonId] || 0) + 1;
      questionsByArea[q.areaCode] = (questionsByArea[q.areaCode] || 0) + 1;
      questionsByDifficulty[q.difficulty] = (questionsByDifficulty[q.difficulty] || 0) + 1;
      questionsByType[q.type] = (questionsByType[q.type] || 0) + 1;
    });

    return {
      totalQuestions: questions.length,
      questionsByLesson,
      questionsByArea,
      questionsByDifficulty,
      questionsByType
    };
  }

  /**
   * Get questions for wrong answers review
   */
  getWrongAnswers(sessionId: string): QuizQuestion[] {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return [];

    const wrongAnswers = session.answers.filter(a => !a.isCorrect);
    return wrongAnswers
      .map(a => this.getQuestion(a.questionId))
      .filter((q): q is QuizQuestion => q !== null);
  }
}

export const quizService = new QuizService();







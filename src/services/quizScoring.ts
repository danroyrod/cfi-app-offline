// Quiz Scoring and Grading System

import type { QuizSession, QuizQuestion } from '../types/quizTypes';

export interface GradeResult {
  score: number;           // 0-100
  grade: string;           // A+, A, B+, B, C, F
  passed: boolean;
  performance: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement' | 'unsatisfactory';
  feedback: string;
}

class QuizScoringService {
  /**
   * Calculate score as percentage
   */
  calculateScore(correctAnswers: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  }

  /**
   * Determine pass/fail
   */
  hasPassed(score: number, passingScore: number = 80): boolean {
    return score >= passingScore;
  }

  /**
   * Get letter grade
   */
  getLetterGrade(score: number): string {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Get performance rating
   */
  getPerformance(score: number): GradeResult['performance'] {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'satisfactory';
    if (score >= 60) return 'needs-improvement';
    return 'unsatisfactory';
  }

  /**
   * Get feedback message
   */
  getFeedback(score: number, _passed: boolean): string {
    if (score === 100) {
      return 'Perfect score! Outstanding knowledge demonstration! 🏆';
    } else if (score >= 95) {
      return 'Excellent work! You have a strong grasp of this material! 🌟';
    } else if (score >= 90) {
      return 'Great job! Your knowledge is very solid. 👏';
    } else if (score >= 85) {
      return 'Good performance! You understand the key concepts well. ✅';
    } else if (score >= 80) {
      return 'You passed! Review the areas you missed to strengthen your knowledge. 📚';
    } else if (score >= 70) {
      return 'Close! Review the weak areas and try again. You can do it! 💪';
    } else if (score >= 60) {
      return 'Needs more study. Focus on the weak areas identified below. 📖';
    } else {
      return 'Significant study needed. Review the lesson plans and try again. 📝';
    }
  }

  /**
   * Generate comprehensive grade result
   */
  gradeSession(session: QuizSession, passingScore: number = 80): GradeResult {
    const score = this.calculateScore(session.correctAnswers, session.totalQuestions);
    const passed = this.hasPassed(score, passingScore);
    const grade = this.getLetterGrade(score);
    const performance = this.getPerformance(score);
    const feedback = this.getFeedback(score, passed);

    return {
      score,
      grade,
      passed,
      performance,
      feedback
    };
  }

  /**
   * Calculate time bonus (optional feature)
   */
  calculateTimeBonus(timeSpent: number, timeLimit: number): number {
    if (!timeLimit) return 0;
    
    const timeUsedPercentage = (timeSpent / (timeLimit * 60)) * 100;
    
    // Bonus for completing quickly (but not too quickly - that's rushing)
    if (timeUsedPercentage < 50) return 0;      // Too fast, probably rushing
    if (timeUsedPercentage < 70) return 5;      // Good pace, 5% bonus
    if (timeUsedPercentage < 90) return 2;      // Decent pace, 2% bonus
    return 0;                                    // No bonus
  }

  /**
   * Get accuracy by category
   */
  getCategoryAccuracy(session: QuizSession, questions: QuizQuestion[]): Record<string, { correct: number; total: number; accuracy: number }> {
    const categoryStats: Record<string, { correct: number; total: number; accuracy: number }> = {};

    session.answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return;

      if (!categoryStats[question.category]) {
        categoryStats[question.category] = { correct: 0, total: 0, accuracy: 0 };
      }

      categoryStats[question.category].total++;
      if (answer.isCorrect) {
        categoryStats[question.category].correct++;
      }
    });

    // Calculate accuracy percentages
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category];
      stats.accuracy = (stats.correct / stats.total) * 100;
    });

    return categoryStats;
  }

  /**
   * Compare performance to previous attempts
   */
  compareToAverage(currentScore: number, sessions: QuizSession[]): {
    isImprovement: boolean;
    difference: number;
    percentile: number;
  } {
    if (sessions.length === 0) {
      return { isImprovement: true, difference: 0, percentile: 100 };
    }

    const scores = sessions.map(s => s.score).sort((a, b) => a - b);
    const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const difference = currentScore - average;
    
    // Calculate percentile
    const belowCurrent = scores.filter(s => s < currentScore).length;
    const percentile = Math.round((belowCurrent / scores.length) * 100);

    return {
      isImprovement: difference > 0,
      difference: Math.round(difference),
      percentile
    };
  }

  /**
   * Get study recommendations based on weak areas
   */
  getStudyRecommendations(weakAreas: QuizSession['weakAreas']): string[] {
    const recommendations: string[] = [];

    if (weakAreas.length === 0) {
      recommendations.push('Great job! All areas show strong understanding.');
      recommendations.push('Keep reviewing regularly to maintain this level.');
      return recommendations;
    }

    recommendations.push('Focus your study on these areas:');
    
    weakAreas.forEach(area => {
      const category = area.category.replace('-', ' ');
      recommendations.push(
        `• ${area.lessonTitle || category}: ${Math.round(area.accuracy)}% accuracy - Review lesson plan and study flashcards`
      );
    });

    recommendations.push('');
    recommendations.push('Suggested study approach:');
    recommendations.push('1. Re-read the lesson plans for weak areas');
    recommendations.push('2. Listen to audio lessons for those topics');
    recommendations.push('3. Study flashcards focused on weak areas');
    recommendations.push('4. Retake the quiz to verify improvement');

    return recommendations;
  }
}

export const quizScoring = new QuizScoringService();


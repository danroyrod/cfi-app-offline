// Quiz Question Generator - Auto-generate questions from lesson content

import type { LessonPlan } from '../lessonPlanTypes';
import { quizService } from './quizService';
import type { QuizQuestion, Quiz } from '../types/quizTypes';

class QuizGeneratorService {
  /**
   * Generate quiz questions from a lesson plan
   */
  generateFromLesson(lesson: LessonPlan): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const areaCode = this.extractAreaCode(lesson.id);

    // 1. Generate from objectives
    if (lesson.objectives && lesson.objectives.length > 0) {
      lesson.objectives.forEach((objective) => {
        const q = this.generateObjectiveQuestion(lesson, objective, areaCode);
        if (q) questions.push(q);
      });
    }

    // 2. Generate from key teaching points (enhanced)
    if (lesson.keyTeachingPoints && lesson.keyTeachingPoints.length > 0) {
      lesson.keyTeachingPoints.slice(0, 4).forEach((point) => {
        const q = this.generateKeyTeachingPointQuestion(lesson, point, areaCode);
        if (q) questions.push(q);
      });
    }

    // 3. Generate from teaching script key points (legacy support)
    if (lesson.teachingScript && lesson.teachingScript.length > 0) {
      lesson.teachingScript.forEach((script) => {
        if (script.keyPoints && script.keyPoints.length > 0) {
          script.keyPoints.slice(0, 2).forEach((point) => {
            const q = this.generateTeachingPointQuestion(lesson, point, script.phase, areaCode);
            if (q) questions.push(q);
          });
        }
      });
    }

    // 4. Generate from safety considerations
    if (lesson.safetyConsiderations && lesson.safetyConsiderations.length > 0) {
      lesson.safetyConsiderations.slice(0, 2).forEach((consideration) => {
        const q = this.generateSafetyQuestion(lesson, consideration, areaCode);
        if (q) questions.push(q);
      });
    }

    // 6. Generate from common errors
    if (lesson.commonErrors && lesson.commonErrors.length > 0) {
      lesson.commonErrors.slice(0, 3).forEach((error) => {
        const q = this.generateErrorQuestion(lesson, error, areaCode);
        if (q) questions.push(q);
      });
    }

    // 7. Generate from completion standards
    if (lesson.completionStandards && lesson.completionStandards.length > 0) {
      lesson.completionStandards.slice(0, 2).forEach((standard) => {
        // Handle both string and object formats
        const standardText = typeof standard === 'string' ? standard : standard.standard || String(standard);
        const q = this.generateStandardQuestion(lesson, standardText, areaCode);
        if (q) questions.push(q);
      });
    }

    return questions;
  }

  /**
   * Generate question from objective
   */
  private generateObjectiveQuestion(
    lesson: LessonPlan,
    objective: string,
    areaCode: string
  ): QuizQuestion | null {
    const distractors = this.generateObjectiveDistractors(objective, lesson);
    const shuffled = this.shuffleWithCorrectFirst([objective, ...distractors]);
    
    const question = quizService.createQuestion({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      areaCode,
      type: 'multiple-choice',
      difficulty: 'easy',
      category: 'objective',
      question: `Which of the following is a learning objective for ${lesson.title}?`,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      explanation: `This is one of the stated learning objectives for ${lesson.title}. Understanding the objectives helps frame your approach to teaching this lesson.`,
      acsReference: `Related to ${lesson.id}`,
      tags: ['objective', areaCode.toLowerCase(), this.slugify(lesson.title)]
    });

    return question;
  }

  /**
   * Generate question from key teaching point (enhanced)
   */
  private generateKeyTeachingPointQuestion(
    lesson: LessonPlan,
    point: string,
    areaCode: string
  ): QuizQuestion | null {
    // Try to extract specific facts (numbers, procedures, requirements)
    const hasNumber = /\d+/.test(point);
    const hasAltitude = /altitude|feet|ft/i.test(point);
    const hasAirspeed = /airspeed|knots|kts/i.test(point);
    const hasTolerance = /±/.test(point);
    
    let question: string;
    let options: string[];
    let correctAnswer: string;

    if (hasTolerance) {
      // Tolerance-related question
      question = `What is the performance tolerance for ${lesson.title}?`;
      correctAnswer = point;
      options = this.generateToleranceDistractors(point);
    } else if (hasAltitude && hasNumber) {
      // Altitude-related question
      const altMatch = point.match(/±?\s*(\d+)\s*(feet|ft)/i);
      if (altMatch) {
        const correctValue = altMatch[1];
        question = `What is the altitude tolerance for ${lesson.title}?`;
        correctAnswer = `±${correctValue} feet`;
        options = this.generateAltitudeDistractors(parseInt(correctValue));
      } else {
        question = `Regarding altitude in ${lesson.title}, what is correct?`;
        correctAnswer = this.truncate(point, 80);
        options = this.generateGenericDistractors(correctAnswer);
      }
    } else if (hasAirspeed && hasNumber) {
      // Airspeed-related question
      const speedMatch = point.match(/±?\s*(\d+)\s*(knots|kts)/i);
      if (speedMatch) {
        const correctValue = speedMatch[1];
        question = `What is the airspeed tolerance for ${lesson.title}?`;
        correctAnswer = `±${correctValue} knots`;
        options = this.generateAirspeedDistractors(parseInt(correctValue));
      } else {
        question = `Regarding airspeed in ${lesson.title}, what is correct?`;
        correctAnswer = this.truncate(point, 80);
        options = this.generateGenericDistractors(correctAnswer);
      }
    } else {
      // General teaching point
      question = `What is a key teaching point for ${lesson.title}?`;
      correctAnswer = this.truncate(point, 80);
      options = this.generateGenericDistractors(correctAnswer);
    }

    const shuffled = this.shuffleWithCorrectFirst([correctAnswer, ...options]);
    
    return quizService.createQuestion({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      areaCode,
      type: 'multiple-choice',
      difficulty: hasNumber ? 'medium' : 'easy',
      category: 'teaching-point',
      question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      explanation: `This is a key teaching point: ${point}`,
      acsReference: `${lesson.id} - Key Teaching Points`,
      teachingTip: `Emphasize this teaching point to help students understand the concept.`,
      tags: ['teaching-point', 'key-point', areaCode.toLowerCase()]
    });
  }

  /**
   * Generate question from teaching point
   */
  private generateTeachingPointQuestion(
    lesson: LessonPlan,
    point: string,
    phase: string,
    areaCode: string
  ): QuizQuestion | null {
    // Try to extract specific facts (numbers, procedures, requirements)
    const hasNumber = /\d+/.test(point);
    const hasAltitude = /altitude|feet|ft/i.test(point);
    const hasAirspeed = /airspeed|knots|kts/i.test(point);
    
    let question: string;
    let options: string[];
    let correctAnswer: string;

    if (hasAltitude && hasNumber) {
      // Altitude-related question
      const altMatch = point.match(/±?\s*(\d+)\s*(feet|ft)/i);
      if (altMatch) {
        const correctValue = altMatch[1];
        question = `What is the altitude tolerance for ${lesson.title}?`;
        correctAnswer = `±${correctValue} feet`;
        options = this.generateAltitudeDistractors(parseInt(correctValue));
      } else {
        question = `Regarding altitude in ${lesson.title}, what is correct?`;
        correctAnswer = this.truncate(point, 80);
        options = this.generateGenericDistractors(correctAnswer);
      }
    } else if (hasAirspeed && hasNumber) {
      // Airspeed-related question
      const speedMatch = point.match(/±?\s*(\d+)\s*(knots|kts)/i);
      if (speedMatch) {
        const correctValue = speedMatch[1];
        question = `What is the airspeed tolerance for ${lesson.title}?`;
        correctAnswer = `±${correctValue} knots`;
        options = this.generateAirspeedDistractors(parseInt(correctValue));
      } else {
        question = `Regarding airspeed in ${lesson.title}, what is correct?`;
        correctAnswer = this.truncate(point, 80);
        options = this.generateGenericDistractors(correctAnswer);
      }
    } else {
      // General teaching point
      question = `During the ${phase} phase of ${lesson.title}, what should be emphasized?`;
      correctAnswer = this.truncate(point, 80);
      options = this.generateGenericDistractors(correctAnswer);
    }

    const shuffled = this.shuffleWithCorrectFirst([correctAnswer, ...options]);
    
    return quizService.createQuestion({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      areaCode,
      type: 'multiple-choice',
      difficulty: hasNumber ? 'medium' : 'easy',
      category: 'teaching-point',
      question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      explanation: `This is a key teaching point from the ${phase} phase: ${point}`,
      acsReference: `${lesson.id} - ${phase}`,
      teachingTip: `Emphasize this during the ${phase} to help students understand the concept.`,
      tags: ['teaching-point', phase.toLowerCase(), areaCode.toLowerCase()]
    });
  }

  /**
   * Generate question from safety consideration
   */
  private generateSafetyQuestion(
    lesson: LessonPlan,
    consideration: string,
    areaCode: string
  ): QuizQuestion | null {
    const question = `What is an important safety consideration for ${lesson.title}?`;
    const correctAnswer = this.truncate(consideration, 80);
    const distractors = this.generateSafetyDistractors(consideration, lesson);

    const shuffled = this.shuffleWithCorrectFirst([correctAnswer, ...distractors]);
    
    return quizService.createQuestion({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      areaCode,
      type: 'multiple-choice',
      difficulty: 'medium',
      category: 'standard',
      question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      explanation: `${consideration} is a critical safety consideration for this lesson.`,
      acsReference: `${lesson.id} - Safety Considerations`,
      teachingTip: 'Always emphasize safety considerations throughout instruction.',
      tags: ['safety', 'consideration', areaCode.toLowerCase()]
    });
  }

  /**
   * Generate question from common error
   */
  private generateErrorQuestion(
    lesson: LessonPlan,
    error: string,
    areaCode: string
  ): QuizQuestion | null {
    const question = `Which of the following is a common error in ${lesson.title}?`;
    const correctAnswer = error;
    const distractors = this.generateErrorDistractors(error, lesson);

    const shuffled = this.shuffleWithCorrectFirst([correctAnswer, ...distractors]);
    
    return quizService.createQuestion({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      areaCode,
      type: 'multiple-choice',
      difficulty: 'medium',
      category: 'error',
      question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      explanation: `${error} is a common error students make. Be prepared to recognize and correct this error during instruction.`,
      acsReference: `${lesson.id} - Common Errors`,
      teachingTip: 'Watch for this error and have a correction strategy ready.',
      tags: ['common-error', 'mistake', areaCode.toLowerCase()]
    });
  }

  /**
   * Generate question from completion standard
   */
  private generateStandardQuestion(
    lesson: LessonPlan,
    standard: string,
    areaCode: string
  ): QuizQuestion | null {
    const question = `What is a completion standard for ${lesson.title}?`;
    const correctAnswer = this.truncate(standard, 80);
    const distractors = this.generateStandardDistractors(standard, lesson);

    const shuffled = this.shuffleWithCorrectFirst([correctAnswer, ...distractors]);
    
    return quizService.createQuestion({
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      areaCode,
      type: 'multiple-choice',
      difficulty: 'hard',
      category: 'standard',
      question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      explanation: `This is an ACS completion standard. The student must demonstrate this level of performance to meet the standard.`,
      acsReference: `${lesson.id} - Completion Standards`,
      teachingTip: 'Ensure students can consistently meet this standard before endorsing.',
      tags: ['standard', 'completion', 'acs', areaCode.toLowerCase()]
    });
  }

  // ==================== DISTRACTOR GENERATION ====================

  /**
   * Generate altitude distractors
   */
  private generateAltitudeDistractors(correctValue: number): string[] {
    const distractors = [
      `±${correctValue / 2} feet`,
      `±${correctValue + 50} feet`,
      `±${correctValue * 2} feet`
    ];
    return distractors.slice(0, 3);
  }

  /**
   * Generate airspeed distractors
   */
  private generateAirspeedDistractors(correctValue: number): string[] {
    const distractors = [
      `±${correctValue / 2} knots`,
      `±${Math.round(correctValue * 1.5)} knots`,
      `±${correctValue * 2} knots`
    ];
    return distractors.slice(0, 3);
  }

  /**
   * Generate tolerance distractors
   */
  private generateToleranceDistractors(tolerance: string): string[] {
    // Extract numbers from tolerance and create variations
    const numbers = tolerance.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const value = parseInt(numbers[0]);
      
      return [
        tolerance.replace(/\d+/, String(Math.round(value / 2))),
        tolerance.replace(/\d+/, String(value + 25)),
        tolerance.replace(/\d+/, String(value * 2))
      ];
    }
    
    // Fallback to generic tolerance distractors
    return [
      '±50 feet',
      '±10 knots',
      '±5°'
    ];
  }

  /**
   * Generate safety distractors
   */
  private generateSafetyDistractors(consideration: string, lesson: LessonPlan): string[] {
    const genericSafety = [
      'Maintain situational awareness at all times',
      'Follow all applicable regulations',
      'Use proper checklists',
      'Maintain aircraft control',
      'Monitor weather conditions',
      'Communicate effectively with ATC'
    ];

    // Add lesson-specific safety considerations if available
    if (lesson.safetyConsiderations && lesson.safetyConsiderations.length > 1) {
      const others = lesson.safetyConsiderations.filter(s => s !== consideration);
      others.forEach(other => {
        genericSafety.push(this.truncate(other, 60));
      });
    }

    return this.selectRandom(genericSafety, 3);
  }

  /**
   * Generate objective distractors
   */
  private generateObjectiveDistractors(objective: string, lesson: LessonPlan): string[] {
    const distractors = [
      'Demonstrate basic aircraft control',
      'Complete pre-flight inspection',
      'Understand weather theory'
    ];

    // Add lesson-specific distractors if available
    if (lesson.objectives && lesson.objectives.length > 1) {
      // Use other objectives as distractors (but modified)
      const other = lesson.objectives.find(o => o !== objective);
      if (other) {
        distractors.push(this.modifySlightly(other));
      }
    }

    return this.selectRandom(distractors, 3);
  }

  /**
   * Generate error distractors (things that are NOT errors)
   */
  private generateErrorDistractors(_error: string, _lesson: LessonPlan): string[] {
    const goodPractices = [
      'Maintaining proper altitude',
      'Using coordinated flight control',
      'Maintaining situational awareness',
      'Following proper procedures',
      'Demonstrating smooth control inputs',
      'Maintaining appropriate airspeed'
    ];

    return this.selectRandom(goodPractices, 3);
  }

  /**
   * Generate standard distractors
   */
  private generateStandardDistractors(standard: string, lesson: LessonPlan): string[] {
    const genericStandards = [
      'Maintains altitude within ±50 feet',
      'Maintains heading within ±5 degrees',
      'Demonstrates safe flight operations',
      'Completes maneuver without instructor intervention'
    ];

    // Use other standards as distractors if available
    if (lesson.completionStandards && lesson.completionStandards.length > 1) {
      lesson.completionStandards.forEach(s => {
        if (s.standard !== standard) {
          genericStandards.push(this.modifySlightly(s.standard));
        }
      });
    }

    return this.selectRandom(genericStandards, 3);
  }

  /**
   * Generate generic distractors
   */
  private generateGenericDistractors(_correctAnswer: string): string[] {
    const generic = [
      'Always maintain visual contact with the runway',
      'Complete the maneuver at maximum airspeed',
      'Use full control deflection throughout',
      'Ignore the performance instruments',
      'Wait for instructor approval before proceeding'
    ];

    return this.selectRandom(generic, 3);
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Shuffle options and track correct index
   */
  private shuffleWithCorrectFirst(options: string[]): { options: string[]; correctIndex: number } {
    const correctAnswer = options[0];
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    const correctIndex = shuffled.indexOf(correctAnswer);
    
    return { options: shuffled, correctIndex };
  }

  /**
   * Select random items from array
   */
  private selectRandom<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Modify text slightly to create plausible distractor
   */
  private modifySlightly(text: string): string {
    // Simple modification: add "not" or change a number
    if (text.includes('must')) {
      return text.replace('must', 'should avoid');
    }
    if (text.includes('should')) {
      return text.replace('should', 'must not');
    }
    return text.replace(/\d+/g, (match) => {
      const num = parseInt(match);
      return String(num + 50);
    });
  }

  /**
   * Truncate text
   */
  private truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Slugify text for tags
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Extract area code from lesson ID
   */
  private extractAreaCode(lessonId: string): string {
    const match = lessonId.match(/LP-([IVX]+)/);
    return match ? match[1] : 'UNKNOWN';
  }

  /**
   * Generate questions for all lessons
   */
  generateForAllLessons(lessons: LessonPlan[]): QuizQuestion[] {
    const allQuestions: QuizQuestion[] = [];
    
    lessons.forEach(lesson => {
      const questions = this.generateFromLesson(lesson);
      allQuestions.push(...questions);
    });

    return allQuestions;
  }

  /**
   * Generate questions for specific area
   */
  generateForArea(lessons: LessonPlan[], areaCode: string): QuizQuestion[] {
    const areaLessons = lessons.filter(l => l.id.includes(`LP-${areaCode}`));
    return this.generateForAllLessons(areaLessons);
  }

  /**
   * Check if lesson already has questions
   */
  hasGeneratedQuestions(lessonId: string): boolean {
    const questions = quizService.getLessonQuestions(lessonId);
    return questions.length > 0;
  }

  /**
   * Estimate question count for a lesson
   */
  estimateQuestionCount(lesson: LessonPlan): number {
    let count = 0;
    
    if (lesson.objectives) count += lesson.objectives.length;
    
    // Enhanced key teaching points
    if (lesson.keyTeachingPoints) count += Math.min(lesson.keyTeachingPoints.length, 4);
    
    // Legacy teaching script key points (reduced)
    if (lesson.teachingScript) {
      lesson.teachingScript.forEach(script => {
        if (script.keyPoints) count += Math.min(script.keyPoints.length, 2);
      });
    }
    
    // New enhanced fields
    if (lesson.safetyConsiderations) count += Math.min(lesson.safetyConsiderations.length, 2);
    
    // Existing fields
    if (lesson.commonErrors) count += Math.min(lesson.commonErrors.length, 3);
    if (lesson.completionStandards) count += Math.min(lesson.completionStandards.length, 2);
    
    return count;
  }

  /**
   * Generate sample questions for preview
   */
  generateSampleQuestions(lesson: LessonPlan, count: number = 3): Array<{
    question: string;
    options: string[];
    correctIndex: number;
    category: string;
  }> {
    const samples: Array<{
      question: string;
      options: string[];
      correctIndex: number;
      category: string;
    }> = [];

    // Sample from objectives
    if (lesson.objectives && lesson.objectives.length > 0 && samples.length < count) {
      const distractors = this.generateObjectiveDistractors(lesson.objectives[0], lesson);
      const shuffled = this.shuffleWithCorrectFirst([lesson.objectives[0], ...distractors]);
      samples.push({
        question: `Which is a learning objective for ${lesson.title}?`,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
        category: 'objective'
      });
    }

    // Sample from teaching points
    if (lesson.teachingScript && lesson.teachingScript.length > 0 && samples.length < count) {
      const firstScript = lesson.teachingScript[0];
      if (firstScript.keyPoints && firstScript.keyPoints.length > 0) {
        const point = firstScript.keyPoints[0];
        const truncated = this.truncate(point, 80);
        const distractors = this.generateGenericDistractors(truncated);
        const shuffled = this.shuffleWithCorrectFirst([truncated, ...distractors]);
        samples.push({
          question: `During ${firstScript.phase}, what is important?`,
          options: shuffled.options,
          correctIndex: shuffled.correctIndex,
          category: 'teaching-point'
        });
      }
    }

    // Sample from errors
    if (lesson.commonErrors && lesson.commonErrors.length > 0 && samples.length < count) {
      const error = lesson.commonErrors[0];
      const distractors = this.generateErrorDistractors(error, lesson);
      const shuffled = this.shuffleWithCorrectFirst([error, ...distractors]);
      samples.push({
        question: `Which is a common error in ${lesson.title}?`,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
        category: 'error'
      });
    }

    return samples;
  }

  /**
   * Create quick quiz (5 random questions)
   */
  createQuickQuiz(lessonId?: string): Quiz | null {
    const allQuestions = lessonId 
      ? quizService.getLessonQuestions(lessonId)
      : quizService.getAllQuestions();

    if (allQuestions.length < 5) return null;

    const selectedQuestions = this.selectRandom(allQuestions, 5);
    
    return quizService.createQuiz({
      name: lessonId ? 'Quick Quiz' : 'Random Quick Quiz',
      description: '5 random questions for quick practice',
      lessonIds: lessonId ? [lessonId] : [],
      questionIds: selectedQuestions.map(q => q.id),
      mode: 'quick',
      difficulty: 'mixed',
      passingScore: 80,
      randomizeQuestions: true,
      randomizeOptions: true,
      showExplanations: true,
      isOfficial: true
    });
  }

  /**
   * Create mock checkride (50-100 questions from all areas)
   */
  createMockCheckride(questionCount: number = 50): Quiz | null {
    const allQuestions = quizService.getAllQuestions();
    
    if (allQuestions.length < questionCount) {
      questionCount = allQuestions.length;
    }

    if (questionCount < 20) return null;

    // Try to get even distribution across areas
    const selectedQuestions = this.selectRandom(allQuestions, questionCount);
    
    return quizService.createQuiz({
      name: 'Mock Checkride',
      description: `Realistic checkride simulation with ${questionCount} questions`,
      lessonIds: [],
      questionIds: selectedQuestions.map(q => q.id),
      mode: 'mock-checkride',
      difficulty: 'mixed',
      timeLimit: 120, // 2 hours
      passingScore: 80,
      randomizeQuestions: true,
      randomizeOptions: true,
      showExplanations: false, // Only at end
      isOfficial: true
    });
  }
}

export const quizGenerator = new QuizGeneratorService();


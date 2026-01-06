// Flashcard Generator - Auto-generate flashcards from lesson content

import type { LessonPlan } from '../lessonPlanTypes';
import { flashcardService } from './flashcardService';
import type { Flashcard } from '../types/flashcardTypes';

class FlashcardGenerator {
  /**
   * Generate flashcards from a lesson plan
   */
  generateFromLesson(lesson: LessonPlan): Flashcard[] {
    const cards: Flashcard[] = [];

    // 1. Generate cards from objectives
    if (lesson.objectives && lesson.objectives.length > 0) {
      lesson.objectives.forEach((objective, index) => {
        const card = flashcardService.createCard(
          lesson.id,
          lesson.title,
          `What is Objective ${index + 1} for ${lesson.title}?`,
          objective,
          'objective',
          ['objective', this.getAreaTag(lesson.id)]
        );
        cards.push(card);
      });
    }

    // 2. Generate cards from key teaching points (top-level, from improved lesson plans)
    if (lesson.keyTeachingPoints && lesson.keyTeachingPoints.length > 0) {
      lesson.keyTeachingPoints.forEach((point) => {
        const question = this.convertToQuestion(point, lesson.title);
        const card = flashcardService.createCard(
          lesson.id,
          lesson.title,
          question,
          point,
          'key-teaching-point' as 'teaching-point', // Use teaching-point category
          ['key-teaching-point', 'teaching-point', this.getAreaTag(lesson.id)]
        );
        cards.push(card);
      });
    }

    // 3. Generate cards from teaching script key points (phase-specific)
    if (lesson.teachingScript && lesson.teachingScript.length > 0) {
      lesson.teachingScript.forEach((script) => {
        if (script.keyPoints && script.keyPoints.length > 0) {
          script.keyPoints.forEach((point) => {
            // Create a question from the key point
            const question = this.convertToQuestion(point, lesson.title);
            const card = flashcardService.createCard(
              lesson.id,
              lesson.title,
              question,
              point,
              'teaching-point',
              ['teaching-point', script.phase, this.getAreaTag(lesson.id)]
            );
            cards.push(card);
          });
        }
      });
    }

    // 4. Generate cards from common errors
    if (lesson.commonErrors && lesson.commonErrors.length > 0) {
      lesson.commonErrors.forEach((error) => {
        const card = flashcardService.createCard(
          lesson.id,
          lesson.title,
          `What is a common error in ${lesson.title}?`,
          error,
          'error',
          ['error', 'common-mistake', this.getAreaTag(lesson.id)]
        );
        cards.push(card);
      });
    }

    // 5. Generate cards from completion standards
    if (lesson.completionStandards && lesson.completionStandards.length > 0) {
      lesson.completionStandards.forEach((standard) => {
        const card = flashcardService.createCard(
          lesson.id,
          lesson.title,
          `What is a completion standard for ${lesson.title}?`,
          standard.standard,
          'standard',
          ['standard', 'completion', this.getAreaTag(lesson.id)]
        );
        cards.push(card);
      });
    }

    return cards;
  }

  /**
   * Convert a statement into a question
   */
  private convertToQuestion(statement: string, lessonTitle: string): string {
    const lower = statement.toLowerCase();

    // Check for common patterns
    if (lower.includes('should') || lower.includes('must')) {
      return `What should the student do regarding: ${this.truncate(statement, 50)}?`;
    } else if (lower.includes('demonstrate') || lower.includes('explain')) {
      return `How should the student demonstrate: ${this.truncate(statement, 50)}?`;
    } else if (lower.includes('understand')) {
      return `What should the student understand about: ${this.truncate(statement, 50)}?`;
    } else {
      return `What is a key teaching point for ${lessonTitle}?`;
    }
  }

  /**
   * Extract area tag from lesson ID
   */
  private getAreaTag(lessonId: string): string {
    const match = lessonId.match(/LP-([IVX]+)/);
    return match ? `area-${match[1]}` : 'unknown-area';
  }

  /**
   * Truncate text for question preview
   */
  private truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Generate flashcards for all lessons
   */
  generateForAllLessons(lessons: LessonPlan[]): Flashcard[] {
    const allCards: Flashcard[] = [];
    
    lessons.forEach(lesson => {
      const cards = this.generateFromLesson(lesson);
      allCards.push(...cards);
    });

    return allCards;
  }

  /**
   * Generate flashcards for specific area
   */
  generateForArea(lessons: LessonPlan[], areaCode: string): Flashcard[] {
    const areaLessons = lessons.filter(l => l.id.includes(`LP-${areaCode}`));
    return this.generateForAllLessons(areaLessons);
  }

  /**
   * Check if lesson already has generated cards
   */
  hasGeneratedCards(lessonId: string): boolean {
    const cards = flashcardService.getLessonCards(lessonId);
    return cards.length > 0;
  }

  /**
   * Get count of cards that would be generated
   */
  estimateCardCount(lesson: LessonPlan): number {
    let count = 0;
    
    if (lesson.objectives) count += lesson.objectives.length;
    
    if (lesson.keyTeachingPoints) count += lesson.keyTeachingPoints.length;
    
    if (lesson.teachingScript) {
      lesson.teachingScript.forEach(script => {
        if (script.keyPoints) count += script.keyPoints.length;
      });
    }
    
    if (lesson.commonErrors) count += lesson.commonErrors.length;
    if (lesson.completionStandards) count += lesson.completionStandards.length;
    
    return count;
  }

  /**
   * Generate sample cards for preview
   */
  generateSampleCards(lesson: LessonPlan, limit: number = 3): Array<{front: string; back: string; category: string}> {
    const samples: Array<{front: string; back: string; category: string}> = [];

    // Sample from objectives
    if (lesson.objectives && lesson.objectives.length > 0 && samples.length < limit) {
      samples.push({
        front: `What is Objective 1 for ${lesson.title}?`,
        back: lesson.objectives[0],
        category: 'objective'
      });
    }

    // Sample from key teaching points (top-level, preferred)
    if (lesson.keyTeachingPoints && lesson.keyTeachingPoints.length > 0 && samples.length < limit) {
      samples.push({
        front: this.convertToQuestion(lesson.keyTeachingPoints[0], lesson.title),
        back: lesson.keyTeachingPoints[0],
        category: 'key-teaching-point'
      });
    }

    // Sample from key points (phase-specific, fallback)
    if (lesson.teachingScript && lesson.teachingScript.length > 0 && samples.length < limit) {
      const firstScript = lesson.teachingScript[0];
      if (firstScript.keyPoints && firstScript.keyPoints.length > 0) {
        samples.push({
          front: this.convertToQuestion(firstScript.keyPoints[0], lesson.title),
          back: firstScript.keyPoints[0],
          category: 'teaching-point'
        });
      }
    }

    // Sample from errors
    if (lesson.commonErrors && lesson.commonErrors.length > 0 && samples.length < limit) {
      samples.push({
        front: `What is a common error in ${lesson.title}?`,
        back: lesson.commonErrors[0],
        category: 'error'
      });
    }

    return samples;
  }
}

export const flashcardGenerator = new FlashcardGenerator();







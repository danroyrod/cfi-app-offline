/**
 * Study Analytics Service (#7)
 * Aggregates flashcard performance data into per-area mastery metrics
 * and identifies weak areas for focused study.
 */

import { flashcardService } from './flashcardService';
import type { Flashcard, FlashcardStats } from '../types/flashcardTypes';

export interface AreaMastery {
  areaNumber: string;
  areaName: string;
  totalCards: number;
  masteredCards: number;
  learningCards: number;
  newCards: number;
  reviewingCards: number;
  masteryPercent: number;
  averageEaseFactor: number;
  weakestTopics: string[];  // lesson titles with lowest mastery
}

export interface StudyInsight {
  type: 'weak-area' | 'due-review' | 'streak' | 'milestone';
  message: string;
  areaNumber?: string;
  priority: 'high' | 'medium' | 'low';
}

class StudyAnalyticsService {
  /**
   * Get mastery breakdown by ACS area
   */
  getAreaMastery(): AreaMastery[] {
    const cards = flashcardService.getAllCards();
    if (cards.length === 0) return [];

    // Group cards by area (extracted from tags or lessonId)
    const areaMap = new Map<string, Flashcard[]>();

    for (const card of cards) {
      const areaTag = card.tags.find(t => t.startsWith('area-'));
      const area = areaTag ? areaTag.replace('area-', '') : this.extractArea(card.lessonId);
      if (!area) continue;

      if (!areaMap.has(area)) areaMap.set(area, []);
      areaMap.get(area)!.push(card);
    }

    const areaNames: Record<string, string> = {
      'I': 'Fundamentals of Instructing',
      'II': 'Technical Subject Areas',
      'III': 'Preflight Preparation',
      'IV': 'Preflight Lesson on a Maneuver',
      'V': 'Preflight Procedures',
      'VI': 'Airport & Seaplane Base Ops',
      'VII': 'Takeoffs, Landings, Go-Arounds',
      'VIII': 'Fundamentals of Flight',
      'IX': 'Performance & Ground Reference',
      'X': 'Slow Flight, Stalls, Spins',
      'XI': 'Basic Instrument Maneuvers',
      'XII': 'Emergency Operations',
      'XIII': 'Multiengine Operations',
      'XIV': 'Postflight Procedures',
    };

    const results: AreaMastery[] = [];

    for (const [area, areaCards] of areaMap) {
      const mastered = areaCards.filter(c => c.status === 'mastered').length;
      const learning = areaCards.filter(c => c.status === 'learning').length;
      const reviewing = areaCards.filter(c => c.status === 'reviewing').length;
      const newCards = areaCards.filter(c => c.status === 'new').length;

      const avgEase = areaCards.length > 0
        ? areaCards.reduce((s, c) => s + c.easeFactor, 0) / areaCards.length
        : 2.5;

      // Find weakest lessons within this area
      const lessonScores = new Map<string, { correct: number; total: number; title: string }>();
      for (const card of areaCards) {
        if (!lessonScores.has(card.lessonId)) {
          lessonScores.set(card.lessonId, { correct: 0, total: 0, title: card.lessonTitle });
        }
        const ls = lessonScores.get(card.lessonId)!;
        ls.total += card.timesReviewed;
        ls.correct += card.timesCorrect;
      }

      const weakest = [...lessonScores.entries()]
        .filter(([, v]) => v.total > 0)
        .map(([, v]) => ({ title: v.title, accuracy: v.total > 0 ? v.correct / v.total : 0 }))
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 3)
        .map(w => w.title);

      results.push({
        areaNumber: area,
        areaName: areaNames[area] || `Area ${area}`,
        totalCards: areaCards.length,
        masteredCards: mastered,
        learningCards: learning,
        newCards: newCards,
        reviewingCards: reviewing,
        masteryPercent: areaCards.length > 0 ? Math.round((mastered / areaCards.length) * 100) : 0,
        averageEaseFactor: Math.round(avgEase * 100) / 100,
        weakestTopics: weakest,
      });
    }

    // Sort by area numeral order
    const order = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV'];
    results.sort((a, b) => order.indexOf(a.areaNumber) - order.indexOf(b.areaNumber));

    return results;
  }

  /**
   * Get actionable study insights
   */
  getInsights(): StudyInsight[] {
    const insights: StudyInsight[] = [];
    const stats = flashcardService.getStats();
    const areas = this.getAreaMastery();

    // Weak areas (below 30% mastery with cards studied)
    for (const area of areas) {
      if (area.masteryPercent < 30 && area.totalCards - area.newCards > 5) {
        insights.push({
          type: 'weak-area',
          message: `Area ${area.areaNumber} (${area.areaName}) needs attention — ${area.masteryPercent}% mastered`,
          areaNumber: area.areaNumber,
          priority: 'high',
        });
      }
    }

    // Due cards
    if (stats.dueToday > 10) {
      insights.push({
        type: 'due-review',
        message: `${stats.dueToday} cards are due for review today`,
        priority: 'medium',
      });
    }

    // Streak
    if (stats.currentStreak >= 7) {
      insights.push({
        type: 'streak',
        message: `${stats.currentStreak}-day study streak! Keep it up.`,
        priority: 'low',
      });
    }

    // Milestones
    if (stats.masteredCards > 0 && stats.masteredCards % 50 === 0) {
      insights.push({
        type: 'milestone',
        message: `Milestone: ${stats.masteredCards} cards mastered!`,
        priority: 'low',
      });
    }

    return insights.sort((a, b) => {
      const prio = { high: 0, medium: 1, low: 2 };
      return prio[a.priority] - prio[b.priority];
    });
  }

  /**
   * Get overall readiness score (0-100)
   */
  getReadinessScore(): number {
    const areas = this.getAreaMastery();
    if (areas.length === 0) return 0;
    const totalMastery = areas.reduce((s, a) => s + a.masteryPercent, 0);
    return Math.round(totalMastery / areas.length);
  }

  private extractArea(lessonId: string): string | null {
    // LP-IX-A → IX
    const match = lessonId.match(/LP-([IVXL]+)-/);
    return match ? match[1] : null;
  }
}

export const studyAnalyticsService = new StudyAnalyticsService();

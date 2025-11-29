/**
 * Search Index Service
 * Builds and maintains a searchable index of all content
 * iOS-ready: Can be pre-built or generated on-demand
 */

import acsData from '../acs_data.json';
import lessonPlansData from '../lessonPlansData.json';
import type { ACSData } from '../types';
import type { LessonPlan } from '../lessonPlanTypes';
import { notesService } from './notesService';
import { universalBookmarkService } from './universalBookmarkService';

export interface SearchableLessonPlan {
  id: string;
  type: 'lesson-plan';
  title: string;
  areaNumber: string;
  taskLetter: string;
  overview: string;
  objectives: string[];
  keyTeachingPoints: string[];
  commonErrors: string[];
  instructorNotes: string[];
  safetyConsiderations: string[];
  searchableText: string;
}

export interface SearchableTask {
  id: string;
  type: 'acs-task';
  title: string;
  areaNumber: string;
  taskLetter: string;
  objective: string;
  notes: string[];
  knowledge: string[];
  riskManagement: string[];
  skills: string[];
  searchableText: string;
}

export interface SearchableNote {
  id: string;
  type: 'note';
  title: string;
  content: string;
  tags: string[];
  resourceType: 'lesson-plan' | 'acs-task';
  resourceId: string;
  searchableText: string;
}

export interface SearchableBookmark {
  id: string;
  type: 'bookmark';
  title: string;
  note?: string;
  tags: string[];
  resourceType: 'lesson-plan' | 'acs-task';
  resourceId: string;
  searchableText: string;
}

export interface SearchIndex {
  lessonPlans: SearchableLessonPlan[];
  acsTasks: SearchableTask[];
  notes: SearchableNote[];
  bookmarks: SearchableBookmark[];
}

class SearchIndexService {
  private index: SearchIndex | null = null;
  private lastBuilt: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Build search index from all data
   */
  buildIndex(): SearchIndex {
    const now = Date.now();
    
    // Return cached index if still valid
    if (this.index && (now - this.lastBuilt) < this.CACHE_DURATION) {
      return this.index;
    }

    const acs = acsData as ACSData;
    const lessons = lessonPlansData as { lessonPlans: LessonPlan[] };

    // Index lesson plans
    const searchableLessonPlans: SearchableLessonPlan[] = lessons.lessonPlans.map(lp => {
      const searchableText = [
        lp.title,
        lp.overview,
        ...lp.objectives,
        ...lp.keyTeachingPoints,
        ...lp.commonErrors,
        ...lp.instructorNotes,
        ...lp.safetyConsiderations,
        ...lp.references,
        ...lp.prerequisites
      ].join(' ').toLowerCase();

      return {
        id: lp.id,
        type: 'lesson-plan',
        title: lp.title,
        areaNumber: lp.areaNumber,
        taskLetter: lp.taskLetter,
        overview: lp.overview,
        objectives: lp.objectives,
        keyTeachingPoints: lp.keyTeachingPoints,
        commonErrors: lp.commonErrors,
        instructorNotes: lp.instructorNotes,
        safetyConsiderations: lp.safetyConsiderations,
        searchableText
      };
    });

    // Index ACS tasks
    const searchableTasks: SearchableTask[] = [];
    acs.areas.forEach(area => {
      area.tasks.forEach(task => {
        const knowledge = task.knowledge.map(k => k.content).join(' ');
        const riskManagement = task.risk_management.map(rm => rm.content).join(' ');
        const skills = task.skills.map(s => s.content).join(' ');
        
        const searchableText = [
          task.name,
          task.objective,
          ...task.notes,
          knowledge,
          riskManagement,
          skills,
          task.references
        ].join(' ').toLowerCase();

        searchableTasks.push({
          id: `${area.number}.${task.letter}`,
          type: 'acs-task',
          title: `Task ${task.letter}: ${task.name}`,
          areaNumber: area.number,
          taskLetter: task.letter,
          objective: task.objective,
          notes: task.notes,
          knowledge: task.knowledge.map(k => k.content),
          riskManagement: task.risk_management.map(rm => rm.content),
          skills: task.skills.map(s => s.content),
          searchableText
        });
      });
    });

    // Index user notes
    const allNotes = notesService.getAllNotes();
    const searchableNotes: SearchableNote[] = allNotes.map(note => ({
      id: note.id,
      type: 'note',
      title: note.title,
      content: note.content,
      tags: note.tags,
      resourceType: note.resourceType,
      resourceId: note.resourceId,
      searchableText: [
        note.title,
        note.content,
        ...note.tags
      ].join(' ').toLowerCase()
    }));

    // Index bookmarks
    const allBookmarks = universalBookmarkService.getAllBookmarks();
    const searchableBookmarks: SearchableBookmark[] = allBookmarks.map(bookmark => ({
      id: bookmark.id,
      type: 'bookmark',
      title: bookmark.title,
      note: bookmark.note,
      tags: bookmark.tags,
      resourceType: bookmark.type,
      resourceId: bookmark.resourceId,
      searchableText: [
        bookmark.title,
        bookmark.note || '',
        ...bookmark.tags
      ].join(' ').toLowerCase()
    }));

    this.index = {
      lessonPlans: searchableLessonPlans,
      acsTasks: searchableTasks,
      notes: searchableNotes,
      bookmarks: searchableBookmarks
    };

    this.lastBuilt = now;
    return this.index;
  }

  /**
   * Get search index (builds if needed)
   */
  getIndex(): SearchIndex {
    return this.buildIndex();
  }

  /**
   * Clear cache and force rebuild
   */
  clearCache(): void {
    this.index = null;
    this.lastBuilt = 0;
  }
}

export const searchIndexService = new SearchIndexService();


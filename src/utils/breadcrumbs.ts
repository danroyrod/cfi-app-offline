import type { BreadcrumbItem } from '../components/Breadcrumbs';
import acsData from '../acs_data.json';
import lessonPlansData from '../lessonPlansData.json';
import type { ACSData } from '../types';
import type { LessonPlan } from '../lessonPlanTypes';

const acs = acsData as ACSData;
const lessons = lessonPlansData as { lessonPlans: LessonPlan[] };

/**
 * Generate breadcrumbs for a route
 */
export function getBreadcrumbsForRoute(
  pathname: string,
  params: Record<string, string> = {}
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];

  // Handle different routes
  if (pathname === '/') {
    return [{ label: 'Home' }];
  }

  if (pathname === '/areas') {
    items.push({ label: 'Areas' });
    return items;
  }

  if (pathname.startsWith('/appendix/') && params.appendixNumber) {
    const appendixNumber = params.appendixNumber;
    const appendix = acs.appendices.find(a => a.number === appendixNumber);
    
    items.push({ label: 'Areas', path: '/areas' });
    items.push({
      label: `Appendix ${appendixNumber}${appendix ? `: ${appendix.name}` : ''}`
    });
    return items;
  }

  if (pathname.startsWith('/area/') && params.areaNumber) {
    const areaNumber = params.areaNumber;
    const area = acs.areas.find(a => a.number === areaNumber);
    
    items.push({ label: 'Areas', path: '/areas' });
    
    if (params.taskLetter) {
      // Task detail page
      const task = area?.tasks.find(t => t.letter === params.taskLetter);
      items.push({
        label: `Area ${areaNumber}${area ? `: ${area.name}` : ''}`,
        path: `/area/${areaNumber}`
      });
      items.push({
        label: `Task ${params.taskLetter}${task ? `: ${task.name}` : ''}`
      });
    } else {
      // Area detail page
      items.push({
        label: `Area ${areaNumber}${area ? `: ${area.name}` : ''}`
      });
    }
    return items;
  }

  if (pathname === '/lesson-plans') {
    items.push({ label: 'Lesson Plans' });
    return items;
  }

  if (pathname.startsWith('/lesson-plans/area/') && params.areaNumber) {
    const areaNumber = params.areaNumber;
    const area = acs.areas.find(a => a.number === areaNumber);
    
    items.push({ label: 'Lesson Plans', path: '/lesson-plans' });
    items.push({
      label: `Area ${areaNumber}${area ? `: ${area.name}` : ''}`
    });
    return items;
  }

  if (pathname === '/lesson-plans/all') {
    items.push({ label: 'Lesson Plans', path: '/lesson-plans' });
    items.push({ label: 'All Lesson Plans' });
    return items;
  }

  if (pathname.startsWith('/lesson-plan/') && params.lessonPlanId) {
    const lessonPlan = lessons.lessonPlans.find(lp => lp.id === params.lessonPlanId);
    const areaNumber = lessonPlan?.areaNumber || '';
    const area = acs.areas.find(a => a.number === areaNumber);
    
    items.push({ label: 'Lesson Plans', path: '/lesson-plans' });
    items.push({
      label: `Area ${areaNumber}${area ? `: ${area.name}` : ''}`,
      path: `/lesson-plans/area/${areaNumber}`
    });
    if (lessonPlan) {
      items.push({
        label: `Task ${lessonPlan.taskLetter}`,
        path: `/area/${areaNumber}/task/${lessonPlan.taskLetter}`
      });
    }
    items.push({
      label: lessonPlan?.title || 'Lesson Plan'
    });
    return items;
  }

  // Other pages
  const pageLabels: Record<string, string> = {
    '/audio-lessons': 'Audio Lessons',
    '/flashcards': 'Flashcards',
    '/flashcards/study': 'Study Flashcards',
    '/quizzes': 'Quizzes',
    '/quizzes/take': 'Take Quiz',
    '/bookmarks': 'Bookmarks',
    '/notes': 'Notes',
    '/search': 'Search Results'
  };

  const label = pageLabels[pathname];
  if (label) {
    // For study pages, add parent
    if (pathname === '/flashcards/study') {
      items.push({ label: 'Flashcards', path: '/flashcards' });
    } else if (pathname === '/quizzes/take') {
      items.push({ label: 'Quizzes', path: '/quizzes' });
    }
    items.push({ label });
    return items;
  }

  return items;
}

/**
 * Generate breadcrumbs for area pages
 */
export function getAreaBreadcrumbs(areaNumber: string): BreadcrumbItem[] {
  const area = acs.areas.find(a => a.number === areaNumber);
  return [
    { label: 'Home', path: '/' },
    { label: 'Areas', path: '/areas' },
    { label: `Area ${areaNumber}${area ? `: ${area.name}` : ''}` }
  ];
}

/**
 * Generate breadcrumbs for task pages
 */
export function getTaskBreadcrumbs(
  areaNumber: string,
  taskLetter: string
): BreadcrumbItem[] {
  const area = acs.areas.find(a => a.number === areaNumber);
  const task = area?.tasks.find(t => t.letter === taskLetter);
  
  return [
    { label: 'Home', path: '/' },
    { label: 'Areas', path: '/areas' },
    {
      label: `Area ${areaNumber}${area ? `: ${area.name}` : ''}`,
      path: `/area/${areaNumber}`
    },
    { label: `Task ${taskLetter}${task ? `: ${task.name}` : ''}` }
  ];
}

/**
 * Generate breadcrumbs for lesson plan pages
 */
export function getLessonPlanBreadcrumbs(lessonPlanId: string): BreadcrumbItem[] {
  const lessonPlan = lessons.lessonPlans.find(lp => lp.id === lessonPlanId);
  if (!lessonPlan) {
    return [
      { label: 'Home', path: '/' },
      { label: 'Lesson Plans', path: '/lesson-plans' },
      { label: 'Lesson Plan' }
    ];
  }

  const areaNumber = lessonPlan.areaNumber;
  const area = acs.areas.find(a => a.number === areaNumber);

  return [
    { label: 'Home', path: '/' },
    { label: 'Lesson Plans', path: '/lesson-plans' },
    {
      label: `Area ${areaNumber}${area ? `: ${area.name}` : ''}`,
      path: `/lesson-plans/area/${areaNumber}`
    },
    {
      label: `Task ${lessonPlan.taskLetter}`,
      path: `/area/${areaNumber}/task/${lessonPlan.taskLetter}`
    },
    { label: lessonPlan.title }
  ];
}


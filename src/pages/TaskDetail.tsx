import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import acsData from '../acs_data.json';
import lessonPlansData from '../lessonPlansData.json';
import type { ACSData, ACSItem } from '../types';
import BookmarkButton from '../components/BookmarkButton';
import NotesPanel from '../components/NotesPanel';
import Breadcrumbs from '../components/Breadcrumbs';
import TableOfContents, { type TableOfContentsSection } from '../components/TableOfContents';
import { getTaskBreadcrumbs } from '../utils/breadcrumbs';

const data = acsData as ACSData;

// Helper function to highlight tolerances in text
function highlightTolerances(text: string) {
  // Match patterns like ±5 knots, ±100 feet, ±10 degrees, etc.
  const toleranceRegex = /([±+\-]\d+\s*(?:knots?|feet|ft|degrees?|°|kts))/gi;
  const parts = text.split(toleranceRegex);

  return parts.map((part, index) => {
    if (toleranceRegex.test(part)) {
      return (
        <span key={index} className="tolerance">
          {part}
        </span>
      );
    }
    return part;
  });
}

function ACSItemComponent({ item }: { item: ACSItem }) {
  // Check if this is a sub-item (ends with lowercase letter like K1a, K1b, etc.)
  const isSubItem = /[a-z]$/.test(item.code);
  
  return (
    <div className={`acs-item ${isSubItem ? 'acs-sub-item' : ''}`}>
      <div className="acs-item-code">{item.code}</div>
      <div className="acs-item-content">{highlightTolerances(item.content)}</div>
    </div>
  );
}

export default function TaskDetail() {
  const { areaNumber, taskLetter } = useParams<{
    areaNumber: string;
    taskLetter: string;
  }>();

  const area = data.areas.find((a) => a.number === areaNumber);
  const task = area?.tasks.find((t) => t.letter === taskLetter);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  
  // Check if a lesson plan exists for this task
  const lessonPlanId = `LP-${areaNumber}-${taskLetter}`;
  const hasLessonPlan = lessonPlansData.lessonPlans.some((lp: any) => lp.id === lessonPlanId);

  // Generate table of contents sections
  const tocSections = useMemo<TableOfContentsSection[]>(() => {
    if (!task) return [];
    
    const sections: TableOfContentsSection[] = [];
    
    if (task.objective) {
      sections.push({ id: 'objective', title: 'Objective', level: 1 });
    }
    if (task.notes.length > 0) {
      sections.push({ id: 'notes', title: 'Notes', level: 1 });
    }
    if (task.knowledge.length > 0) {
      sections.push({ id: 'knowledge', title: 'Knowledge', level: 1 });
    }
    if (task.risk_management.length > 0) {
      sections.push({ id: 'risk-management', title: 'Risk Management', level: 1 });
    }
    if (task.skills.length > 0) {
      sections.push({ id: 'skills', title: 'Skills', level: 1 });
    }
    
    return sections;
  }, [task]);

  if (!area || !task) {
    return (
      <>
        <div className="header">
          <div className="container header-content">
            <div className="header-title">CFI Airplane ACS</div>
            <Link to="/areas" className="back-link">
              ← Back to Areas
            </Link>
          </div>
        </div>
        <div className="main-content">
          <div className="container">
            <h1 className="page-title">Task not found</h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="header">
        <div className="container header-content">
          <div className="header-title">CFI Airplane ACS</div>
          <Link to={`/area/${areaNumber}`} className="back-link">
            ← Back to Area {areaNumber}
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          {areaNumber && taskLetter && (
            <Breadcrumbs items={getTaskBreadcrumbs(areaNumber, taskLetter)} />
          )}
          <div className="task-detail">
            <div className="task-detail-header">
              <div className="task-detail-title-row">
              <h1 className="task-detail-title">
                Task {task.letter}: {task.name}
              </h1>
              {tocSections.length > 0 && (
                <div className="task-toc-wrapper">
                  <TableOfContents sections={tocSections} sticky={false} collapsible={true} />
                </div>
              )}
                <div className="task-detail-actions">
                  <BookmarkButton
                    type="acs-task"
                    resourceId={`${areaNumber}.${taskLetter}`}
                    title={`Task ${task.letter}: ${task.name}`}
                    areaNumber={areaNumber || ''}
                  />
                  <button
                    onClick={() => setIsNotesOpen(true)}
                    className="task-notes-button"
                    title="View Notes"
                  >
                    📝 Notes
                  </button>
                </div>
              </div>
              {task.references && (
                <div className="task-references">References: {task.references}</div>
              )}
              {hasLessonPlan && (
                <Link to={`/lesson-plan/${lessonPlanId}`} className="lesson-plan-link">
                  📚 View Lesson Plan for This Task →
                </Link>
              )}
            </div>

            {/* Objective */}
            {task.objective && (
              <div className="task-section">
                <h2 className="section-title" id="objective">
                  <span className="section-icon">🎯</span>
                  Objective
                </h2>
                <div className="objective-text">{task.objective}</div>
              </div>
            )}

            {/* Notes */}
            {task.notes.length > 0 && (
              <div className="task-section">
                <h2 className="section-title" id="notes">
                  <span className="section-icon">📝</span>
                  Notes
                </h2>
                {task.notes.map((note, index) => (
                  <div key={index} className="note-item">
                    {note}
                  </div>
                ))}
              </div>
            )}

            {/* Knowledge */}
            {task.knowledge.length > 0 && (
              <div className="task-section">
                <h2 className="section-title" id="knowledge">
                  <span className="section-icon">📚</span>
                  Knowledge
                </h2>
                <div className="acs-items-list">
                  {task.knowledge.map((item, index) => (
                    <ACSItemComponent key={index} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Risk Management */}
            {task.risk_management.length > 0 && (
              <div className="task-section">
                <h2 className="section-title" id="risk-management">
                  <span className="section-icon">⚠️</span>
                  Risk Management
                </h2>
                <div className="acs-items-list">
                  {task.risk_management.map((item, index) => (
                    <ACSItemComponent key={index} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {task.skills.length > 0 && (
              <div className="task-section">
                <h2 className="section-title" id="skills">
                  <span className="section-icon">✈️</span>
                  Skills
                </h2>
                <div className="acs-items-list">
                  {task.skills.map((item, index) => (
                    <ACSItemComponent key={index} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Button */}
      <button 
        className="print-button" 
        onClick={() => window.print()}
        title="Print this ACS task"
      >
        <span>🖨️</span>
        <span>Print Task</span>
      </button>

      {/* Notes Panel */}
      <NotesPanel
        resourceType="acs-task"
        resourceId={`${areaNumber}.${taskLetter}`}
        resourceTitle={`Task ${task.letter}: ${task.name}`}
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />
    </>
  );
}


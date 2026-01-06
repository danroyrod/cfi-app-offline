import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import lessonPlansData from '../lessonPlansData.json';
import type { LessonPlan } from '../lessonPlanTypes';
import DiagramViewer from '../components/DiagramViewer';
import BookmarkButton from '../components/BookmarkButton';
import NotesPanel from '../components/NotesPanel';
import Breadcrumbs from '../components/Breadcrumbs';
import TableOfContents, { type TableOfContentsSection } from '../components/TableOfContents';
import { getLessonPlanBreadcrumbs } from '../utils/breadcrumbs';
import './LessonPlanDetail.css';

const data = lessonPlansData as { lessonPlans: LessonPlan[] };

export default function LessonPlanDetail() {
  const { lessonPlanId } = useParams<{ lessonPlanId: string }>();
  const lessonPlan = data.lessonPlans.find((lp) => lp.id === lessonPlanId);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Generate table of contents sections
  const tocSections = useMemo<TableOfContentsSection[]>(() => {
    if (!lessonPlan) return [];
    
    const sections: TableOfContentsSection[] = [
      { id: 'overview', title: 'Overview', level: 1 },
      { id: 'objectives', title: 'Lesson Objectives', level: 1 },
    ];

    if (lessonPlan.prerequisites.length > 0) {
      sections.push({ id: 'prerequisites', title: 'Prerequisites', level: 1 });
    }

    sections.push(
      { id: 'references', title: 'References', level: 1 },
      { id: 'equipment', title: 'Required Equipment', level: 1 },
      { id: 'teaching-script', title: 'Teaching Script', level: 1 },
      { id: 'key-teaching-points', title: 'Key Teaching Points', level: 1 },
      { id: 'common-errors', title: 'Common Errors to Watch For', level: 1 }
    );

    if (lessonPlan.diagrams && lessonPlan.diagrams.length > 0 && 
        lessonPlan.diagrams.some(d => d.svg || d.imageUrl || d.asciiArt)) {
      sections.push({ id: 'diagrams', title: 'Diagrams & Visual Aids', level: 1 });
    }

    if (lessonPlan.completionStandards && lessonPlan.completionStandards.length > 0) {
      sections.push({ id: 'completion-standards', title: 'Completion Standards (ACS)', level: 1 });
    }

    if (lessonPlan.safetyConsiderations && lessonPlan.safetyConsiderations.length > 0) {
      sections.push({ id: 'safety-considerations', title: 'Safety Considerations', level: 1 });
    }

    sections.push({ id: 'instructor-notes', title: 'Instructor Notes', level: 1 });

    if (lessonPlan.suggestedHomework && lessonPlan.suggestedHomework.length > 0) {
      sections.push({ id: 'suggested-homework', title: 'Suggested Homework', level: 1 });
    }

    if (lessonPlan.notes.length > 0) {
      sections.push({ id: 'additional-notes', title: 'Additional Notes', level: 1 });
    }

    return sections;
  }, [lessonPlan]);

  if (!lessonPlan) {
    return (
      <>
        <div className="header">
          <div className="container header-content">
            <div className="header-title">Lesson Plans</div>
            <Link to="/lesson-plans" className="back-link">
              ← Back to Lesson Plans
            </Link>
          </div>
        </div>
        <div className="main-content">
          <div className="container">
            <h1 className="page-title">Lesson Plan not found</h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="header">
        <div className="container header-content">
            <div className="header-title">Lesson Plans</div>
          <Link to="/lesson-plans" className="back-link">
            ← Back to Lesson Plans
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <Breadcrumbs items={getLessonPlanBreadcrumbs(lessonPlan.id)} />
          <div className="lesson-plan-detail">
            {/* Header Section */}
            <div className="lp-header">
              <h1 className="lp-title">{lessonPlan.title}</h1>
              {tocSections.length > 0 && (
                <div className="lp-toc-wrapper">
                  <TableOfContents sections={tocSections} sticky={false} collapsible={true} />
                </div>
              )}
              <div className="lp-meta">
                <span className="lp-time">⏱️ {lessonPlan.estimatedTime}</span>
                <button
                  onClick={() => window.print()}
                  className="lp-print-button"
                  title="Print this lesson plan"
                >
                  🖨️ Print Lesson
                </button>
                <BookmarkButton
                  type="lesson-plan"
                  resourceId={lessonPlan.id}
                  title={lessonPlan.title}
                  areaNumber={lessonPlan.areaNumber}
                />
                <button
                  onClick={() => setIsNotesOpen(true)}
                  className="lp-notes-button"
                  title="View Notes"
                >
                  📝 Notes
                </button>
                <Link 
                  to={`/area/${lessonPlan.areaNumber}/task/${lessonPlan.taskLetter}`}
                  className="lp-acs-link"
                >
                  📋 View Related ACS Task
                </Link>
              </div>
            </div>

            {/* Overview */}
            <div className="lp-section">
              <h2 className="lp-section-title" id="overview">📖 Overview</h2>
              <p className="lp-overview">{lessonPlan.overview}</p>
            </div>

            {/* Objectives */}
            <div className="lp-section">
              <h2 className="lp-section-title" id="objectives">🎯 Lesson Objectives</h2>
              <ul className="lp-list">
                {lessonPlan.objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            {lessonPlan.prerequisites.length > 0 && (
              <div className="lp-section">
                <h2 className="lp-section-title" id="prerequisites">📋 Prerequisites</h2>
                <ul className="lp-list">
                  {lessonPlan.prerequisites.map((prereq, index) => (
                    <li key={index}>{prereq}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* References */}
            <div className="lp-section">
              <h2 className="lp-section-title" id="references">📚 References</h2>
              <ul className="lp-list">
                {lessonPlan.references.map((ref, index) => (
                  <li key={index} className="lp-reference">{ref}</li>
                ))}
              </ul>
            </div>

            {/* Equipment */}
            <div className="lp-section">
              <h2 className="lp-section-title" id="equipment">🛠️ Required Equipment</h2>
              <div className="lp-equipment-grid">
                {lessonPlan.equipment.map((item, index) => (
                  <div key={index} className="lp-equipment-item">
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Teaching Script */}
            <div className="lp-section lp-teaching-script">
              <h2 className="lp-section-title" id="teaching-script">👨‍🏫 Teaching Script</h2>
              <p className="lp-script-intro">
                Follow this structured approach to deliver the lesson effectively. Adapt timing and depth based on student needs.
              </p>
              {lessonPlan.teachingScript.map((phase, index) => (
                <div key={index} className="lp-script-phase">
                  <div className="lp-phase-header">
                    <h3 className="lp-phase-title">{phase.phase}</h3>
                    <span className="lp-phase-duration">{phase.duration}</span>
                  </div>
                  
                  <div className="lp-phase-content">
                    <div className="lp-phase-section">
                      <h4>Instructor Actions:</h4>
                      <ul>
                        {phase.instructorActions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="lp-phase-section">
                      <h4>Student Actions:</h4>
                      <ul>
                        {phase.studentActions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="lp-phase-section lp-key-points">
                      <h4>🔑 Key Points:</h4>
                      <ul>
                        {phase.keyPoints.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Teaching Points */}
            <div className="lp-section">
              <h2 className="lp-section-title" id="key-teaching-points">💡 Key Teaching Points</h2>
              <div className="lp-key-points-grid">
                {lessonPlan.keyTeachingPoints.map((point, index) => (
                  <div key={index} className="lp-key-point-card">
                    <span className="lp-key-point-number">{index + 1}</span>
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Errors */}
            <div className="lp-section lp-errors-section">
              <h2 className="lp-section-title" id="common-errors">⚠️ Common Errors to Watch For</h2>
              <div className="lp-errors-list">
                {lessonPlan.commonErrors.map((error, index) => (
                  <div key={index} className="lp-error-item">
                    <span className="lp-error-icon">❌</span>
                    <p>{error}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagrams - Only show if valid diagrams exist */}
            {lessonPlan.diagrams && lessonPlan.diagrams.length > 0 && 
             lessonPlan.diagrams.some(d => d.svg || d.imageUrl || d.asciiArt) && (
              <div className="lp-section">
                <h2 className="lp-section-title" id="diagrams">📐 Diagrams & Visual Aids</h2>
                {lessonPlan.diagrams
                  .filter(d => d.svg || d.imageUrl || d.asciiArt)
                  .map((diagram, index) => (
                    <DiagramViewer 
                      key={index} 
                      diagram={diagram} 
                      className="lp-diagram"
                    />
                  ))}
              </div>
            )}

            {/* Completion Standards - Only show if valid standards exist */}
            {lessonPlan.completionStandards && lessonPlan.completionStandards.length > 0 && (
              <div className="lp-section">
                <h2 className="lp-section-title" id="completion-standards">✅ Completion Standards (ACS)</h2>
                <div className="lp-standards-list">
                  {lessonPlan.completionStandards.map((standard, index) => (
                    <div key={index} className="lp-standard-item">
                      <div className="lp-standard-code">{standard.acsReference}</div>
                      <div className="lp-standard-text">{standard.standard}</div>
                      {standard.tolerance && (
                        <div className="lp-standard-tolerance">
                          <strong>Tolerance:</strong> {standard.tolerance}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Considerations - Only show for flight lessons */}
            {lessonPlan.safetyConsiderations && lessonPlan.safetyConsiderations.length > 0 && (
              <div className="lp-section lp-safety-section">
                <h2 className="lp-section-title" id="safety-considerations">🔴 Safety Considerations</h2>
                <div className="lp-safety-list">
                  {lessonPlan.safetyConsiderations.map((safety, index) => (
                    <div key={index} className="lp-safety-item">
                      <span className="lp-safety-icon">🔴</span>
                      <p>{safety}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor Notes */}
            <div className="lp-section lp-notes-section">
              <h2 className="lp-section-title" id="instructor-notes">📝 Instructor Notes</h2>
              <div className="lp-notes-list">
                {lessonPlan.instructorNotes.map((note, index) => (
                  <div key={index} className="lp-note-item">
                    💡 {note}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Homework */}
            {lessonPlan.suggestedHomework && lessonPlan.suggestedHomework.length > 0 && (
              <div className="lp-section">
                <h2 className="lp-section-title" id="suggested-homework">📖 Suggested Homework</h2>
                <ul className="lp-list">
                  {lessonPlan.suggestedHomework.map((hw, index) => (
                    <li key={index}>{hw}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            {lessonPlan.notes.length > 0 && (
              <div className="lp-section">
                <h2 className="lp-section-title" id="additional-notes">📌 Additional Notes</h2>
                <div className="lp-notes-list">
                  {lessonPlan.notes.map((note, index) => (
                    <div key={index} className="lp-note-item">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back to ACS Link */}
            <div className="lp-footer">
              <Link 
                to={`/area/${lessonPlan.areaNumber}/task/${lessonPlan.taskLetter}`}
                className="lp-footer-link"
              >
                ← Back to ACS Task {lessonPlan.areaNumber}.{lessonPlan.taskLetter}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Panel */}
      <NotesPanel
        resourceType="lesson-plan"
        resourceId={lessonPlan.id}
        resourceTitle={lessonPlan.title}
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />
    </>
  );
}


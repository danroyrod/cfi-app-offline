import { useState } from 'react';
import './DeepDive.css';

export interface DeepDiveSection {
  title: string;
  content: string;
  highlights: string[];
}

export interface DeepDiveData {
  lessonPlanId: string;
  source: string;
  sections: DeepDiveSection[];
  keyTakeaways: string[];
  totalLength: number;
  sectionCount: number;
}

interface DeepDiveProps {
  data: DeepDiveData;
}

export default function DeepDive({ data }: DeepDiveProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [showAllTakeaways, setShowAllTakeaways] = useState(false);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(data.sections.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const readingTime = Math.ceil(data.totalLength / 1200); // ~200 words/min, ~6 chars/word

  return (
    <div className="deep-dive">
      <div className="deep-dive-header">
        <div className="deep-dive-header-content">
          <h3 className="deep-dive-title">🔬 Deep Dive</h3>
          <p className="deep-dive-subtitle">
            Extended content from professional CFI materials
          </p>
          <div className="deep-dive-meta">
            <span className="deep-dive-meta-item">📄 {data.sectionCount} sections</span>
            <span className="deep-dive-meta-item">⏱️ ~{readingTime} min read</span>
            <span className="deep-dive-meta-item">📚 Source: {data.source}</span>
          </div>
        </div>
        <div className="deep-dive-actions">
          <button onClick={expandAll} className="deep-dive-action-btn" aria-label="Expand all sections">
            Expand All
          </button>
          <button onClick={collapseAll} className="deep-dive-action-btn" aria-label="Collapse all sections">
            Collapse All
          </button>
        </div>
      </div>

      {/* Key Takeaways */}
      {data.keyTakeaways && data.keyTakeaways.length > 0 && (
        <div className="deep-dive-takeaways">
          <h4 className="deep-dive-takeaways-title">⚡ Key Takeaways</h4>
          <ul className="deep-dive-takeaways-list">
            {(showAllTakeaways ? data.keyTakeaways : data.keyTakeaways.slice(0, 5)).map((takeaway, i) => (
              <li key={i}>{takeaway}</li>
            ))}
          </ul>
          {data.keyTakeaways.length > 5 && (
            <button
              className="deep-dive-show-more"
              onClick={() => setShowAllTakeaways(!showAllTakeaways)}
            >
              {showAllTakeaways ? 'Show less' : `Show all ${data.keyTakeaways.length} takeaways`}
            </button>
          )}
        </div>
      )}

      {/* Sections Accordion */}
      <div className="deep-dive-sections">
        {data.sections.map((section, index) => {
          const isExpanded = expandedSections.has(index);
          const contentPreview = section.content.slice(0, 150);

          return (
            <div key={index} className={`deep-dive-section ${isExpanded ? 'expanded' : ''}`}>
              <button
                className="deep-dive-section-header"
                onClick={() => toggleSection(index)}
                aria-expanded={isExpanded}
                aria-controls={`deep-dive-content-${index}`}
              >
                <span className="deep-dive-section-number">{index + 1}</span>
                <span className="deep-dive-section-title">{section.title}</span>
                <span className="deep-dive-section-toggle">
                  {isExpanded ? '▼' : '▶'}
                </span>
              </button>

              {!isExpanded && (
                <div className="deep-dive-section-preview">
                  {contentPreview}...
                </div>
              )}

              {isExpanded && (
                <div
                  className="deep-dive-section-content"
                  id={`deep-dive-content-${index}`}
                >
                  {section.content.split('\n').map((paragraph, pIndex) => {
                    if (!paragraph.trim()) return null;
                    return <p key={pIndex}>{paragraph}</p>;
                  })}

                  {section.highlights && section.highlights.length > 0 && (
                    <div className="deep-dive-highlights">
                      <strong>Key Points:</strong>
                      <ul>
                        {section.highlights.map((h, hIndex) => (
                          <li key={hIndex}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

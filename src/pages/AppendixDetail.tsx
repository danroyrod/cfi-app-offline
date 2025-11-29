import { Link, useParams } from 'react-router-dom';
import acsData from '../acs_data.json';
import type { ACSData, AppendixSection } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbsForRoute } from '../utils/breadcrumbs';
import { useLocation } from 'react-router-dom';

const data = acsData as ACSData;

export default function AppendixDetail() {
  const { appendixNumber } = useParams<{ appendixNumber: string }>();
  const location = useLocation();
  const appendix = data.appendices.find((a) => a.number === appendixNumber);

  if (!appendix) {
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
            <h1 className="page-title">Appendix not found</h1>
          </div>
        </div>
      </>
    );
  }

  const renderSectionContent = (section: AppendixSection) => {
    const { content } = section;
    
    return (
      <div className="appendix-section-content">
        {content.overview && (
          <div className="appendix-overview">
            <p>{content.overview}</p>
          </div>
        )}

        {content.requirements && content.requirements.length > 0 && (
          <div className="appendix-requirements">
            <h4>Requirements</h4>
            {content.requirements.map((req, idx) => (
              <div key={idx} className="requirement-category">
                <strong>{req.category}:</strong>
                <ul>
                  {req.details.map((detail, detailIdx) => (
                    <li key={detailIdx}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {content.guidelines && content.guidelines.length > 0 && (
          <div className="appendix-guidelines">
            <h4>Guidelines</h4>
            {typeof content.guidelines[0] === 'string' ? (
              <ul>
                {(content.guidelines as string[]).map((guideline, idx) => (
                  <li key={idx}>{guideline}</li>
                ))}
              </ul>
            ) : (
              (content.guidelines as Array<{ category: string; details: string[] }>).map((guideline, idx) => (
                <div key={idx} className="guideline-category">
                  <strong>{guideline.category}:</strong>
                  <ul>
                    {guideline.details.map((detail, detailIdx) => (
                      <li key={detailIdx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {content.responsibilities && content.responsibilities.length > 0 && (
          <div className="appendix-responsibilities">
            <h4>Responsibilities</h4>
            <ul>
              {content.responsibilities.map((responsibility, idx) => (
                <li key={idx}>{responsibility}</li>
              ))}
            </ul>
          </div>
        )}

        {content.limitations && content.limitations.length > 0 && (
          <div className="appendix-limitations">
            <h4>Limitations</h4>
            {content.limitations.map((limitation, idx) => (
              <div key={idx} className="limitation-item">
                <strong>{limitation.limitation}:</strong>
                <p>{limitation.description}</p>
                {limitation.details && limitation.details.length > 0 && (
                  <ul>
                    {limitation.details.map((detail, detailIdx) => (
                      <li key={detailIdx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {content.recent_experience && content.recent_experience.length > 0 && (
          <div className="appendix-recent-experience">
            <h4>Recent Experience</h4>
            <ul>
              {content.recent_experience.map((exp, idx) => (
                <li key={idx}>{exp}</li>
              ))}
            </ul>
          </div>
        )}

        {content.references && content.references.length > 0 && (
          <div className="appendix-references">
            <h4>References</h4>
            <ul>
              {content.references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

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
          <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname, { appendixNumber: appendixNumber || '' })} />
          
          <div className="appendix-detail">
            <div className="appendix-header">
              <h1 className="appendix-title">
                Appendix {appendix.number}: {appendix.name}
              </h1>
              {appendix.description && (
                <p className="appendix-description">{appendix.description}</p>
              )}
            </div>

            <div className="appendix-sections">
              {appendix.sections.map((section, index) => (
                <div key={index} className="appendix-section">
                  <h2 className="appendix-section-title">{section.title}</h2>
                  {renderSectionContent(section)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


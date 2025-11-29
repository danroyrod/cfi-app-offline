import { Link } from 'react-router-dom';
import acsData from '../acs_data.json';
import type { ACSData } from '../types';

const data = acsData as ACSData;

export default function AreasIndex() {
  return (
    <>
      <div className="header">
        <div className="container header-content">
          <div className="header-title">CFI Airplane ACS</div>
          <Link to="/" className="back-link">
            ← Home
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <h1 className="page-title">Areas of Operation</h1>

          <div className="areas-grid">
            {data.areas.map((area) => (
              <Link
                key={area.number}
                to={`/area/${area.number}`}
                className="area-card"
              >
                <div className="area-number">{area.number}</div>
                <div className="area-name">{area.name}</div>
                <div className="area-task-count">
                  {area.tasks.length} {area.tasks.length === 1 ? 'Task' : 'Tasks'}
                </div>
              </Link>
            ))}
          </div>

          <h2 className="appendices-title">Appendices</h2>

          <div className="appendices-grid">
            {data.appendices.map((appendix) => (
              <Link
                key={appendix.number}
                to={`/appendix/${appendix.number}`}
                className="appendix-card"
              >
                <div className="appendix-number">Appendix {appendix.number}</div>
                <div className="appendix-name">{appendix.name}</div>
                <div className="appendix-sections">
                  {appendix.sections.length} {appendix.sections.length === 1 ? 'Section' : 'Sections'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


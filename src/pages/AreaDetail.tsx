import { Link, useParams } from 'react-router-dom';
import acsData from '../acs_data.json';
import type { ACSData } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import { getAreaBreadcrumbs } from '../utils/breadcrumbs';

const data = acsData as ACSData;

export default function AreaDetail() {
  const { areaNumber } = useParams<{ areaNumber: string }>();
  const area = data.areas.find((a) => a.number === areaNumber);

  if (!area) {
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
            <h1 className="page-title">Area not found</h1>
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
          <Link to="/areas" className="back-link">
            ← Back to Areas
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <Breadcrumbs items={getAreaBreadcrumbs(area.number)} />
          <div className="area-header">
            <h1 className="area-header-title">
              Area {area.number}: {area.name}
            </h1>
            <div className="area-task-count">
              {area.tasks.length} {area.tasks.length === 1 ? 'Task' : 'Tasks'}
            </div>
            {area.notes.length > 0 && (
              <div className="area-notes">
                {area.notes.map((note, index) => (
                  <div key={index} style={{ marginBottom: '0.5rem' }}>
                    <strong>Note:</strong> {note}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tasks-list">
            {area.tasks.map((task) => (
              <Link
                key={task.letter}
                to={`/area/${area.number}/task/${task.letter}`}
                className="task-card"
              >
                <div className="task-header">
                  <div className="task-letter">{task.letter}</div>
                  <div className="task-info">
                    <div className="task-name">{task.name}</div>
                    {task.references && (
                      <div className="task-references" style={{ marginTop: '0.5rem' }}>
                        References: {task.references}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


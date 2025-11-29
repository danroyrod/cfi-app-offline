import { Link } from 'react-router-dom';
import acsData from '../acs_data.json';
import type { ACSData } from '../types';

const data = acsData as ACSData;

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">
          {data.title}
        </h1>
        <h2 className="landing-subtitle">
          {data.subtitle}
        </h2>
        <div className="landing-doc-number">
          {data.document_number}
        </div>
        <div className="landing-date">
          {data.date}
        </div>
        
        <div className="landing-buttons">
          <Link to="/areas" className="btn-primary btn-acs">
            <span className="btn-icon">📋</span>
            <span className="btn-content">
              <span className="btn-title">ACS Standards</span>
              <span className="btn-description">View all 85 tasks and requirements</span>
            </span>
          </Link>
          
          <Link to="/lesson-plans" className="btn-primary btn-lessons">
            <span className="btn-icon">📚</span>
            <span className="btn-content">
              <span className="btn-title">Lesson Plans</span>
              <span className="btn-description">Complete teaching guides with scripts</span>
            </span>
          </Link>
          
          <Link to="/audio-lessons" className="btn-primary btn-audio">
            <span className="btn-icon">🎧</span>
            <span className="btn-content">
              <span className="btn-title">Audio Lessons</span>
              <span className="btn-description">Learn while driving or multitasking</span>
            </span>
          </Link>

          <Link to="/flashcards" className="btn-primary btn-flashcards">
            <span className="btn-icon">🎴</span>
            <span className="btn-content">
              <span className="btn-title">Flashcards</span>
              <span className="btn-description">Spaced repetition for long-term retention</span>
            </span>
          </Link>

          <Link to="/quizzes" className="btn-primary btn-quizzes">
            <span className="btn-icon">❓</span>
            <span className="btn-content">
              <span className="btn-title">Quizzes</span>
              <span className="btn-description">Test your knowledge before checkride</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}


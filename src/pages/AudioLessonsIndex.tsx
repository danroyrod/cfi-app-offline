import { Link } from 'react-router-dom';
import './AudioLessonsIndex.css';

const AudioLessonsIndex = () => {
  return (
    <div className="audio-lessons-index-page">
      <div className="container">
        <Link to="/" className="audio-index-back-link">← Back to Home</Link>
        <div className="audio-index-header">
          <h1 className="audio-index-title">
            <span className="audio-index-icon">🎧</span>
            Audio Lessons
          </h1>
          <p className="audio-index-subtitle">
            Learn on the go with our comprehensive audio lesson library. Choose between full detailed lessons or quick lite summaries.
          </p>
        </div>

        <div className="audio-lessons-options">
          <Link to="/audio-lessons/full" className="audio-option-card audio-option-full">
            <div className="audio-option-icon">📚</div>
            <h2 className="audio-option-title">Full Audio Lessons</h2>
            <p className="audio-option-description">
              Complete lesson plans with full teaching scripts, instructor actions, detailed explanations, and all content.
            </p>
            <div className="audio-option-features">
              <div className="audio-option-feature">✓ Complete teaching scripts</div>
              <div className="audio-option-feature">✓ Instructor actions & dialogue</div>
              <div className="audio-option-feature">✓ Detailed explanations</div>
              <div className="audio-option-feature">✓ All lesson components</div>
            </div>
            <div className="audio-option-duration">
              <span className="audio-option-duration-label">Duration:</span>
              <span className="audio-option-duration-value">~15-30 min per lesson</span>
            </div>
            <div className="audio-option-button">
              Explore Full Lessons →
            </div>
          </Link>

          <Link to="/audio-lessons/lite" className="audio-option-card audio-option-lite">
            <div className="audio-option-icon">⚡</div>
            <h2 className="audio-option-title">Lite Audio Lessons</h2>
            <p className="audio-option-description">
              Quick summaries with key points, objectives, and completion standards. Perfect for quick review and study on the go.
            </p>
            <div className="audio-option-features">
              <div className="audio-option-feature">✓ Lesson objectives</div>
              <div className="audio-option-feature">✓ Key points per component</div>
              <div className="audio-option-feature">✓ Key teaching points</div>
              <div className="audio-option-feature">✓ Completion standards</div>
            </div>
            <div className="audio-option-duration">
              <span className="audio-option-duration-label">Duration:</span>
              <span className="audio-option-duration-value">~5-10 min per lesson</span>
            </div>
            <div className="audio-option-button">
              Explore Lite Lessons →
            </div>
          </Link>
        </div>

        <div className="audio-index-info">
          <h3 className="audio-info-title">About Audio Lessons</h3>
          <div className="audio-info-grid">
            <div className="audio-info-card">
              <div className="audio-info-icon">🎯</div>
              <h4>Study Anywhere</h4>
              <p>Listen while commuting, exercising, or reviewing during downtime.</p>
            </div>
            <div className="audio-info-card">
              <div className="audio-info-icon">🔁</div>
              <h4>Repeat Anytime</h4>
              <p>Replay lessons as many times as needed to master the content.</p>
            </div>
            <div className="audio-info-card">
              <div className="audio-info-icon">📱</div>
              <h4>Mobile Friendly</h4>
              <p>Works perfectly on your phone, tablet, or computer.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioLessonsIndex;

import React, { useState } from 'react';
import type { Diagram, KeyPoint } from '../lessonPlanTypes';
import './DiagramViewer.css';

interface DiagramViewerProps {
  diagram: Diagram;
  className?: string;
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({ diagram, className = '' }) => {
  const [selectedKeyPoint, setSelectedKeyPoint] = useState<KeyPoint | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredKeyPoint, setHoveredKeyPoint] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const handleKeyPointClick = (keyPoint: KeyPoint) => {
    setSelectedKeyPoint(keyPoint);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedKeyPoint(null);
  };

  const handleKeyPointHover = (event: React.MouseEvent, description: string, index: number) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      text: description
    });
    setHoveredKeyPoint(index);
  };

  const handleKeyPointLeave = () => {
    setTooltip(null);
    setHoveredKeyPoint(null);
  };

  const toggleZoom = () => setIsZoomed(!isZoomed);

  // Render SVG diagram if available
  if (diagram.svg) {
    const svgContent = diagram.svg;
    const hasKeyPoints = diagram.keyPoints && diagram.keyPoints.length > 0;
    const isInteractive = hasKeyPoints || diagram.interactive;

    return (
      <div className={`diagram-container ${isInteractive ? 'interactive-diagram-container' : ''} ${className}`}>
        <div className="diagram-header">
          <h3 className="diagram-title">{diagram.title}</h3>
          <p className="diagram-description">{diagram.description}</p>
          {isInteractive && (
            <div className="diagram-controls">
              <button 
                className="diagram-zoom-btn"
                onClick={toggleZoom}
                title={isZoomed ? "Zoom out" : "Zoom in"}
              >
                {isZoomed ? "🔍−" : "🔍+"}
              </button>
            </div>
          )}
        </div>
        
        <div className={`diagram-content ${isZoomed ? 'zoomed' : ''}`}>
          <div 
            className="diagram-svg-wrapper"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
          
          {hasKeyPoints && diagram.keyPoints && (
            <div className="key-points-overlay">
              {diagram.keyPoints.map((point, index) => {
                const keyPoint: KeyPoint = typeof point === 'string' 
                  ? { description: point, angle: (360 / diagram.keyPoints!.length) * index }
                  : point;
                
                return (
                  <button
                    key={index}
                    className={`key-point-marker ${hoveredKeyPoint === index ? 'hovered' : ''}`}
                    style={{
                      left: `${50 + (keyPoint.angle ? Math.cos((keyPoint.angle - 90) * Math.PI / 180) * 30 : 0)}%`,
                      top: `${50 + (keyPoint.angle ? Math.sin((keyPoint.angle - 90) * Math.PI / 180) * 30 : 0)}%`
                    }}
                    onClick={() => handleKeyPointClick(keyPoint)}
                    onMouseEnter={(e) => handleKeyPointHover(e, keyPoint.description, index)}
                    onMouseLeave={handleKeyPointLeave}
                    title={keyPoint.description}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {tooltip && (
          <div 
            className="key-point-tooltip"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translateX(-50%)'
            }}
          >
            {tooltip.text}
          </div>
        )}

        {showDetails && selectedKeyPoint && (
          <div className="key-point-details">
            <div className="details-header">
              <h4>Key Point Details</h4>
              <button 
                className="close-button"
                onClick={handleCloseDetails}
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            <div className="details-content">
              <p><strong>Description:</strong> {selectedKeyPoint.description}</p>
              {selectedKeyPoint.angle !== undefined && (
                <p><strong>Angle:</strong> {selectedKeyPoint.angle}°</p>
              )}
              {selectedKeyPoint.altitude && (
                <p><strong>Altitude:</strong> {selectedKeyPoint.altitude} feet</p>
              )}
              {selectedKeyPoint.pitch && (
                <p><strong>Pitch:</strong> {selectedKeyPoint.pitch}°</p>
              )}
              {selectedKeyPoint.bank && (
                <p><strong>Bank:</strong> {selectedKeyPoint.bank}°</p>
              )}
            </div>
          </div>
        )}

        {diagram.data && (
          <div className="performance-data">
            <h4>Performance Data</h4>
            <div className="data-grid">
              {diagram.data.altitudeMarkers && (
                <div className="data-item">
                  <strong>Altitude Markers:</strong> {diagram.data.altitudeMarkers.join(', ')} feet
                </div>
              )}
              {diagram.data.pitchMarkers && (
                <div className="data-item">
                  <strong>Pitch Markers:</strong> {diagram.data.pitchMarkers.join(', ')}°
                </div>
              )}
              {diagram.data.bankMarkers && (
                <div className="data-item">
                  <strong>Bank Markers:</strong> {diagram.data.bankMarkers.join(', ')}°
                </div>
              )}
              {diagram.data.airspeedMarkers && (
                <div className="data-item">
                  <strong>Airspeed Markers:</strong> {diagram.data.airspeedMarkers.join(', ')} knots
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render professional diagram if available
  if (diagram.imageUrl) {
    return (
      <div className={`diagram-container ${className}`}>
        <div className="diagram-header">
          <h3 className="diagram-title">{diagram.title}</h3>
          <p className="diagram-description">{diagram.description}</p>
        </div>
        
        <div className="diagram-content">
          {diagram.interactive ? (
            <div className="interactive-diagram">
              <img 
                src={diagram.imageUrl} 
                alt={diagram.title}
                className="diagram-image"
                onClick={() => setShowDetails(!showDetails)}
              />
              
              {diagram.keyPoints && (
                <div className="key-points-overlay">
                  {diagram.keyPoints.map((point, index) => {
                    const keyPoint: KeyPoint = typeof point === 'string' 
                      ? { description: point, angle: (360 / diagram.keyPoints!.length) * index }
                      : point;
                    return (
                      <button
                        key={index}
                        className="key-point-marker"
                        style={{
                          left: `${((keyPoint.angle || 0) / 360) * 100}%`,
                          top: `${50 - ((keyPoint.altitude || 0) / 10)}%`
                        }}
                        onClick={() => handleKeyPointClick(keyPoint)}
                        title={keyPoint.description}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <img 
              src={diagram.imageUrl} 
              alt={diagram.title}
              className="diagram-image"
            />
          )}
        </div>

        {showDetails && selectedKeyPoint && (
          <div className="key-point-details">
            <div className="details-header">
              <h4>Key Point Details</h4>
              <button 
                className="close-button"
                onClick={handleCloseDetails}
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            <div className="details-content">
              <p><strong>Angle:</strong> {selectedKeyPoint.angle}°</p>
              <p><strong>Description:</strong> {selectedKeyPoint.description}</p>
              {selectedKeyPoint.altitude && (
                <p><strong>Altitude:</strong> {selectedKeyPoint.altitude} feet</p>
              )}
              {selectedKeyPoint.pitch && (
                <p><strong>Pitch:</strong> {selectedKeyPoint.pitch}°</p>
              )}
              {selectedKeyPoint.bank && (
                <p><strong>Bank:</strong> {selectedKeyPoint.bank}°</p>
              )}
            </div>
          </div>
        )}

        {diagram.data && (
          <div className="performance-data">
            <h4>Performance Data</h4>
            <div className="data-grid">
              {diagram.data.altitudeMarkers && (
                <div className="data-item">
                  <strong>Altitude Markers:</strong> {diagram.data.altitudeMarkers.join(', ')}°
                </div>
              )}
              {diagram.data.pitchMarkers && (
                <div className="data-item">
                  <strong>Pitch Markers:</strong> {diagram.data.pitchMarkers.join(', ')}°
                </div>
              )}
              {diagram.data.bankMarkers && (
                <div className="data-item">
                  <strong>Bank Markers:</strong> {diagram.data.bankMarkers.join(', ')}°
                </div>
              )}
              {diagram.data.airspeedMarkers && (
                <div className="data-item">
                  <strong>Airspeed Markers:</strong> {diagram.data.airspeedMarkers.join(', ')} knots
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback to ASCII art
  if (diagram.asciiArt) {
    return (
      <div className={`diagram-container ascii-diagram ${className}`}>
        <div className="diagram-header">
          <h3 className="diagram-title">{diagram.title}</h3>
          <p className="diagram-description">{diagram.description}</p>
        </div>
        <div className="diagram-content">
          <pre className="ascii-content">{diagram.asciiArt}</pre>
        </div>
      </div>
    );
  }

  // No diagram content
  return (
    <div className={`diagram-container no-content ${className}`}>
      <div className="diagram-header">
        <h3 className="diagram-title">{diagram.title}</h3>
        <p className="diagram-description">{diagram.description}</p>
      </div>
      <div className="diagram-content">
        <p className="no-content-message">Diagram content not available</p>
      </div>
    </div>
  );
};

export default DiagramViewer;





export interface TeachingScript {
  phase: string; // e.g., "Introduction", "Demonstration", "Practice", "Evaluation"
  duration: string; // e.g., "5 minutes"
  instructorActions: string[];
  studentActions: string[];
  keyPoints: string[];
}

export interface KeyPoint {
  angle: number;
  description: string;
  altitude?: number;
  pitch?: number;
  bank?: number;
}

export interface PerformanceData {
  altitudeMarkers: number[];
  pitchMarkers: number[];
  bankMarkers?: number[];
  airspeedMarkers?: number[];
}

export interface Diagram {
  title: string;
  description: string;
  type?: 'flightPath' | 'attitude' | 'performance' | 'safety' | 'basic' | 'overview' | 'takeoff-profile' | 'landing-profile' | 'stall-characteristics' | 'turn-forces' | 'climb-performance' | 'water-conditions' | 'night-vision' | 'altitude-effects' | 'engine-failure' | 'emergency-flow';
  imageUrl?: string; // For professional SVG diagrams
  svg?: string; // Inline SVG content
  interactive?: boolean; // For interactive elements
  data?: PerformanceData; // For flight path data
  keyPoints?: (KeyPoint | string)[]; // For interactive key points (can be strings or KeyPoint objects)
  asciiArt?: string; // Fallback for text-based diagrams
}

export interface CompletionStandard {
  standard: string;
  acsReference: string; // Link back to ACS code (e.g., "AI.VII.A.S12")
  tolerance?: string; // e.g., "±5 knots", "±100 feet"
}

export interface LessonPlan {
  id: string; // e.g., "LP-I-A"
  areaNumber: string; // e.g., "I"
  taskLetter: string; // e.g., "A"
  title: string;
  estimatedTime: string; // e.g., "1.5 hours"
  
  // Core Components
  objectives: string[];
  references: string[];
  prerequisites: string[];
  
  // Teaching Content
  overview: string;
  teachingScript: TeachingScript[];
  keyTeachingPoints: string[];
  commonErrors: string[];
  
  // Visual Aids
  diagrams: Diagram[];
  
  // Standards
  completionStandards: CompletionStandard[];
  
  // Additional Resources
  equipment: string[];
  notes: string[];
  suggestedHomework?: string[];
  
  // Instructor Guidance
  instructorNotes: string[];
  safetyConsiderations: string[];
}

export interface LessonPlanData {
  lessonPlans: LessonPlan[];
}


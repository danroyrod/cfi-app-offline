export interface ACSItem {
  code: string;
  content: string;
}

export interface Task {
  letter: string;
  name: string;
  references: string;
  objective: string;
  notes: string[];
  knowledge: ACSItem[];
  risk_management: ACSItem[];
  skills: ACSItem[];
}

export interface Area {
  number: string;
  name: string;
  notes: string[];
  tasks: Task[];
}

export interface AppendixSection {
  title: string;
  content: {
    overview?: string;
    requirements?: Array<{ category: string; details: string[] }>;
    guidelines?: string[] | Array<{ category: string; details: string[] }>;
    responsibilities?: string[] | Array<{ category: string; details: string[] }>;
    limitations?: Array<{ limitation: string; description: string; details: string[] }>;
    recent_experience?: string[];
    references?: string[];
    [key: string]: any; // Allow other content structures
  };
}

export interface Appendix {
  number: string;
  name: string;
  description?: string;
  sections: AppendixSection[];
}

export interface ACSData {
  document_number: string;
  title: string;
  subtitle: string;
  date: string;
  areas: Area[];
  appendices: Appendix[];
}


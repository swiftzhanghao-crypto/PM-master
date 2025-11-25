
export enum SkillCategory {
  DASHBOARD = 'Dashboard',
  COURSES = 'Courses',
  REQUIREMENTS = 'Requirements',
  DATA_ANALYSIS = 'Data Analysis',
  PROJECT_MANAGEMENT = 'Project Management',
  PROTOTYPING = 'Prototyping',
  INTERVIEW = 'Interview',
  EXAM = 'Exam',
  AI_MENTOR = 'AI Mentor'
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface MetricData {
  name: string;
  value: number;
  target?: number;
}

export interface Certificate {
  id: string;
  levelId: string; // e.g., 'l1'
  title: string;   // e.g., 'Level 1: 产品助理结业证书'
  issueDate: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  level: string; // e.g., 'Lvl 3'
  role: string; // e.g., '高级产品经理'
  progress: number; // e.g., 12 (modules unlocked)
  examScore: number; // e.g., 85
  certificates: Certificate[];
}

export interface Order {
  id: string;
  itemTitle: string;
  price: number;
  date: string;
  status: 'completed';
}

export type UserRole = 'ADMIN' | 'BUREAU_HEAD' | 'EXPERT' | 'REVIEWER' | 'PUBLIC_VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  institution?: string;
}

export type CurriculumStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED';
export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';

export interface LearningOutcome {
  id: string;
  description: string;
  bloomLevel: BloomLevel;
  assessmentMethod: string;
}

export interface Module {
  id: string;
  title: string;
  code: string;
  credits: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  description: string;
  topics: string[];
  learningOutcomes: LearningOutcome[];
}

export interface Curriculum {
  _id: string;
  title: string;
  code: string;
  degree: string;
  branch: string;
  academicYear: string;
  totalCredits: number;
  status: CurriculumStatus;
  description: string;
  author: User | string;
  reviewer?: User | string;
  reviewNotes?: string;
  modules: Module[];
  nepComplianceScore: number;
  nepDetails?: {
    status: string;
    passedChecks: string[];
    failedChecks: string[];
    warnings: string[];
    recommendations: string[];
  };
  currentVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumVersion {
  _id: string;
  curriculumId: string;
  version: string;
  author: User;
  message: string;
  snapshot: Curriculum;
  tag?: string;
  createdAt: string;
}

export interface NepCheckResult {
  name: string;
  category: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
}

export interface NepReport {
  score: number;
  status: string;
  passedCount: number;
  failedCount: number;
  warningCount: number;
  checks: NepCheckResult[];
  recommendations: string[];
}

export interface BloomReport {
  distribution: Record<BloomLevel, number>;
  dominantLevel: string;
  higherOrderThinkingRatio: number;
  evaluationSummary: string;
  recommendations: string[];
}

export interface CommentItem {
  _id: string;
  curriculumId: string;
  moduleId?: string;
  author: User;
  content: string;
  resolved: boolean;
  createdAt: string;
}

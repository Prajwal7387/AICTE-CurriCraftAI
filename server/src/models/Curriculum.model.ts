import mongoose, { Schema, Document } from 'mongoose';

export type CurriculumStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED';
export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';

export interface ILearningOutcome {
  id: string;
  description: string;
  bloomLevel: BloomLevel;
  assessmentMethod: string;
}

export interface IModule {
  id: string;
  title: string;
  code: string;
  credits: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  description: string;
  topics: string[];
  learningOutcomes: ILearningOutcome[];
}

export interface ICurriculum extends Document {
  title: string;
  code: string;
  degree: string;
  branch: string;
  academicYear: string;
  totalCredits: number;
  status: CurriculumStatus;
  description: string;
  author: mongoose.Types.ObjectId;
  reviewer?: mongoose.Types.ObjectId;
  modules: IModule[];
  nepComplianceScore: number;
  nepDetails?: {
    status: string;
    passedChecks: string[];
    failedChecks: string[];
    warnings: string[];
    recommendations: string[];
  };
  currentVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

const LearningOutcomeSchema = new Schema<ILearningOutcome>({
  id: { type: String, required: true },
  description: { type: String, required: true },
  bloomLevel: {
    type: String,
    enum: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
    default: 'Understand',
  },
  assessmentMethod: { type: String, default: 'Direct Assessment / Lab Work' },
});

const ModuleSchema = new Schema<IModule>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  code: { type: String, required: true },
  credits: { type: Number, required: true, default: 3 },
  lectureHours: { type: Number, default: 3 },
  tutorialHours: { type: Number, default: 0 },
  practicalHours: { type: Number, default: 0 },
  description: { type: String, default: '' },
  topics: [{ type: String }],
  learningOutcomes: [LearningOutcomeSchema],
});

const CurriculumSchema = new Schema<ICurriculum>(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    degree: { type: String, required: true, default: 'B.Tech' },
    branch: { type: String, required: true, default: 'Computer Science & Engineering' },
    academicYear: { type: String, required: true, default: '2026-2027' },
    totalCredits: { type: Number, required: true, default: 160 },
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED'],
      default: 'DRAFT',
    },
    description: { type: String, default: '' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
    modules: [ModuleSchema],
    nepComplianceScore: { type: Number, default: 85 },
    nepDetails: {
      status: { type: String, default: 'Mostly Compliant' },
      passedChecks: [{ type: String }],
      failedChecks: [{ type: String }],
      warnings: [{ type: String }],
      recommendations: [{ type: String }],
    },
    currentVersion: { type: String, default: 'v1.0' },
  },
  { timestamps: true }
);

export const Curriculum = mongoose.model<ICurriculum>('Curriculum', CurriculumSchema);

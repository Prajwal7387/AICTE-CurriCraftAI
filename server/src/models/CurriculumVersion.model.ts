import mongoose, { Schema, Document } from 'mongoose';

export interface ICurriculumVersion extends Document {
  curriculumId: mongoose.Types.ObjectId;
  version: string;
  author: mongoose.Types.ObjectId;
  message: string;
  snapshot: any;
  tag?: string;
  createdAt: Date;
}

const CurriculumVersionSchema = new Schema<ICurriculumVersion>(
  {
    curriculumId: { type: Schema.Types.ObjectId, ref: 'Curriculum', required: true },
    version: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    snapshot: { type: Schema.Types.Mixed, required: true },
    tag: { type: String, default: 'General Snapshot' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const CurriculumVersion = mongoose.model<ICurriculumVersion>(
  'CurriculumVersion',
  CurriculumVersionSchema
);

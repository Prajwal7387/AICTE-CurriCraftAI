import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  curriculumId: mongoose.Types.ObjectId;
  moduleId?: string;
  author: mongoose.Types.ObjectId;
  content: string;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    curriculumId: { type: Schema.Types.ObjectId, ref: 'Curriculum', required: true },
    moduleId: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);

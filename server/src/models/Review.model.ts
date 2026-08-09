import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  curriculumId: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  status: 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';
  feedback: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    curriculumId: { type: Schema.Types.ObjectId, ref: 'Curriculum', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['APPROVED', 'CHANGES_REQUESTED', 'REJECTED'],
      required: true,
    },
    feedback: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);

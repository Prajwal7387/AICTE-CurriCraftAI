import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'REVIEW_REQUEST' | 'APPROVAL' | 'REJECTION' | 'COMMENT_MENTION' | 'CURRICULUM_PUBLISHED';
  linkUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['REVIEW_REQUEST', 'APPROVAL', 'REJECTION', 'COMMENT_MENTION', 'CURRICULUM_PUBLISHED'],
      default: 'REVIEW_REQUEST',
    },
    linkUrl: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

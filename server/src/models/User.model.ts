import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'ADMIN' | 'BUREAU_HEAD' | 'EXPERT' | 'REVIEWER' | 'PUBLIC_VIEWER';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department?: string;
  institution?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'BUREAU_HEAD', 'EXPERT', 'REVIEWER', 'PUBLIC_VIEWER'],
      default: 'EXPERT',
    },
    department: { type: String, default: 'Computer Science & Engineering' },
    institution: { type: String, default: 'AICTE Headquarters' },
    avatarUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

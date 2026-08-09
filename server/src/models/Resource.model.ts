import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  type: 'NPTEL' | 'SWAYAM' | 'OPEN_BOOK' | 'RESEARCH_PAPER' | 'DOCUMENTATION';
  url: string;
  domain: string;
  branch: string;
  description: string;
  authorOrProvider: string;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['NPTEL', 'SWAYAM', 'OPEN_BOOK', 'RESEARCH_PAPER', 'DOCUMENTATION'],
      required: true,
    },
    url: { type: String, required: true },
    domain: { type: String, required: true },
    branch: { type: String, required: true },
    description: { type: String, default: '' },
    authorOrProvider: { type: String, default: 'SWAYAM / NPTEL' },
  },
  { timestamps: true }
);

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

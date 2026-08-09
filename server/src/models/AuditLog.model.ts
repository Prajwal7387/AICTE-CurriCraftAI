import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user: mongoose.Types.ObjectId;
  action: string;
  targetType: string;
  targetId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String },
    details: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Curriculum } from '../models/Curriculum.model';
import { Review } from '../models/Review.model';
import { Notification } from '../models/Notification.model';

export const submitForReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { curriculumId } = req.params;
    const curriculum = await Curriculum.findById(curriculumId);

    if (!curriculum) {
      res.status(404).json({ success: false, error: 'Curriculum not found' });
      return;
    }

    curriculum.status = 'SUBMITTED';
    await curriculum.save();

    res.status(200).json({ success: true, message: 'Curriculum submitted for AICTE Bureau review', data: curriculum });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Submission failed' });
  }
};

export const submitReviewDecision = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { curriculumId } = req.params;
    const { status, feedback } = req.body; // 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED'

    const curriculum = await Curriculum.findById(curriculumId);
    if (!curriculum) {
      res.status(404).json({ success: false, error: 'Curriculum not found' });
      return;
    }

    await Review.create({
      curriculumId,
      reviewer: req.user.userId,
      status,
      feedback: feedback || 'Reviewed by AICTE Committee',
    });

    curriculum.status = status === 'APPROVED' ? 'APPROVED' : status === 'CHANGES_REQUESTED' ? 'CHANGES_REQUESTED' : 'DRAFT';
    curriculum.reviewer = req.user.userId as any;
    await curriculum.save();

    // Create Notification
    await Notification.create({
      recipient: curriculum.author,
      sender: req.user.userId,
      title: `Review Decision: ${status}`,
      message: `Your curriculum "${curriculum.title}" was reviewed. Decision: ${status}.`,
      type: status === 'APPROVED' ? 'APPROVAL' : 'REJECTION',
    });

    res.status(200).json({ success: true, message: `Curriculum status updated to ${curriculum.status}`, data: curriculum });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Review processing failed' });
  }
};

export const publishCurriculum = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { curriculumId } = req.params;
    const curriculum = await Curriculum.findById(curriculumId);

    if (!curriculum) {
      res.status(404).json({ success: false, error: 'Curriculum not found' });
      return;
    }

    curriculum.status = 'PUBLISHED';
    await curriculum.save();

    res.status(200).json({ success: true, message: 'Curriculum published to AICTE Public Model Portal', data: curriculum });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Publishing failed' });
  }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Comment } from '../models/Comment.model';

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { curriculumId } = req.params;
    const comments = await Comment.find({ curriculumId })
      .populate('author', 'name email role department')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching comments' });
  }
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { curriculumId, moduleId, content } = req.body;
    const comment = await Comment.create({
      curriculumId,
      moduleId,
      content,
      author: req.user.userId,
    });

    const populated = await comment.populate('author', 'name email role department');
    res.status(201).json({ success: true, data: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error adding comment' });
  }
};

export const toggleResolveComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }

    comment.resolved = !comment.resolved;
    await comment.save();

    res.status(200).json({ success: true, data: comment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error updating comment' });
  }
};

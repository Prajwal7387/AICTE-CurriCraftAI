import { Router } from 'express';
import { getComments, addComment, toggleResolveComment } from '../controllers/comment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/:curriculumId', getComments);
router.post('/', authenticateToken, addComment);
router.patch('/resolve/:commentId', authenticateToken, toggleResolveComment);

export default router;

import { Router } from 'express';
import { submitForReview, submitReviewDecision, publishCurriculum } from '../controllers/review.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/submit/:curriculumId', authenticateToken, submitForReview);
router.post('/decision/:curriculumId', authenticateToken, submitReviewDecision);
router.post('/publish/:curriculumId', authenticateToken, publishCurriculum);

export default router;

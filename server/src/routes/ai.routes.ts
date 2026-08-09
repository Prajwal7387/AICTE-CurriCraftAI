import { Router } from 'express';
import { generateSyllabus, improveOutcome, analyzeGaps } from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate-syllabus', authenticateToken, generateSyllabus);
router.post('/improve-outcome', authenticateToken, improveOutcome);
router.post('/analyze-gaps', authenticateToken, analyzeGaps);

export default router;

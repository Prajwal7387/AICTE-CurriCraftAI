import { Router } from 'express';
import {
  createVersion,
  getVersionHistory,
  compareVersions,
  restoreVersion,
} from '../controllers/version.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, createVersion);
router.get('/history/:curriculumId', getVersionHistory);
router.get('/compare', compareVersions);
router.post('/restore/:versionId', authenticateToken, restoreVersion);

export default router;

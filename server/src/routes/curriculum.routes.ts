import { Router } from 'express';
import {
  getCurricula,
  getCurriculumById,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
} from '../controllers/curriculum.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCurricula);
router.get('/:id', getCurriculumById);
router.post('/', authenticateToken, createCurriculum);
router.put('/:id', authenticateToken, updateCurriculum);
router.delete('/:id', authenticateToken, deleteCurriculum);

export default router;

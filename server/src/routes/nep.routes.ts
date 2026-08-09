import { Router } from 'express';
import { evaluateNepCompliance, analyzeBloomTaxonomy } from '../controllers/nep.controller';

const router = Router();

router.post('/evaluate', evaluateNepCompliance);
router.post('/bloom-analysis', analyzeBloomTaxonomy);

export default router;

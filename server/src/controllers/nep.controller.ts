import { Request, Response } from 'express';
import { NepService } from '../services/nep.service';
import { BloomService } from '../services/bloom.service';
import { Curriculum } from '../models/Curriculum.model';

export const evaluateNepCompliance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { curriculumId, curriculumData } = req.body;
    let targetData = curriculumData;

    if (curriculumId && !targetData) {
      targetData = await Curriculum.findById(curriculumId);
    }

    if (!targetData) {
      res.status(400).json({ success: false, error: 'Valid curriculum data or curriculumId required' });
      return;
    }

    const report = NepService.evaluateCurriculum(targetData);
    res.status(200).json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'NEP evaluation error' });
  }
};

export const analyzeBloomTaxonomy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { outcomes } = req.body;
    const report = BloomService.analyzeOutcomes(outcomes || []);
    res.status(200).json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Bloom analysis error' });
  }
};

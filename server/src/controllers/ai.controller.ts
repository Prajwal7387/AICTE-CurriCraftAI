import { Request, Response } from 'express';
import { AiService } from '../services/ai.service';

export const generateSyllabus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, branch, degree } = req.body;
    if (!title) {
      res.status(400).json({ success: false, error: 'Course title is required' });
      return;
    }

    const modules = await AiService.generateSyllabus(title, branch || 'Computer Science', degree || 'B.Tech');
    res.status(200).json({ success: true, data: modules });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI generation failed' });
  }
};

export const improveOutcome = async (req: Request, res: Response): Promise<void> => {
  try {
    const { outcomeText, targetBloomLevel } = req.body;
    if (!outcomeText) {
      res.status(400).json({ success: false, error: 'Outcome text is required' });
      return;
    }

    const result = await AiService.improveOutcome(outcomeText, targetBloomLevel || 'Apply');
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI outcome enhancement failed' });
  }
};

export const analyzeGaps = async (req: Request, res: Response): Promise<void> => {
  try {
    const { curriculum } = req.body;
    if (!curriculum) {
      res.status(400).json({ success: false, error: 'Curriculum data is required' });
      return;
    }

    const result = await AiService.analyzeGaps(curriculum);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI gap analysis failed' });
  }
};

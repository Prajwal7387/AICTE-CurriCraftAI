import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CurriculumVersion } from '../models/CurriculumVersion.model';
import { Curriculum } from '../models/Curriculum.model';

export const createVersion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { curriculumId, version, message, tag } = req.body;
    const curriculum = await Curriculum.findById(curriculumId);

    if (!curriculum) {
      res.status(404).json({ success: false, error: 'Curriculum not found' });
      return;
    }

    const snapshotVersion = await CurriculumVersion.create({
      curriculumId,
      version: version || `v1.${Date.now().toString().slice(-2)}`,
      author: req.user.userId,
      message: message || 'Manual snapshot save',
      snapshot: curriculum.toObject(),
      tag: tag || 'Version Tag',
    });

    curriculum.currentVersion = snapshotVersion.version;
    await curriculum.save();

    res.status(201).json({
      success: true,
      message: `Version ${snapshotVersion.version} created successfully`,
      data: snapshotVersion,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error creating version' });
  }
};

export const getVersionHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { curriculumId } = req.params;
    const versions = await CurriculumVersion.find({ curriculumId })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: versions.length, data: versions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching version history' });
  }
};

export const compareVersions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { v1Id, v2Id } = req.query;

    const version1 = await CurriculumVersion.findById(v1Id);
    const version2 = await CurriculumVersion.findById(v2Id);

    if (!version1 || !version2) {
      res.status(404).json({ success: false, error: 'One or both versions not found' });
      return;
    }

    const s1 = version1.snapshot;
    const s2 = version2.snapshot;

    const diff = {
      v1: { version: version1.version, message: version1.message, totalCredits: s1.totalCredits, modulesCount: s1.modules?.length || 0 },
      v2: { version: version2.version, message: version2.message, totalCredits: s2.totalCredits, modulesCount: s2.modules?.length || 0 },
      titleChanged: s1.title !== s2.title,
      creditDelta: (s2.totalCredits || 0) - (s1.totalCredits || 0),
      moduleDelta: (s2.modules?.length || 0) - (s1.modules?.length || 0),
      modulesAdded: (s2.modules || []).filter((m2: any) => !(s1.modules || []).some((m1: any) => m1.code === m2.code)),
      modulesRemoved: (s1.modules || []).filter((m1: any) => !(s2.modules || []).some((m2: any) => m2.code === m1.code)),
    };

    res.status(200).json({ success: true, data: diff });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error comparing versions' });
  }
};

export const restoreVersion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { versionId } = req.params;
    const versionDoc = await CurriculumVersion.findById(versionId);

    if (!versionDoc) {
      res.status(404).json({ success: false, error: 'Version snapshot not found' });
      return;
    }

    const snapshot = versionDoc.snapshot;
    const restored = await Curriculum.findByIdAndUpdate(
      versionDoc.curriculumId,
      {
        $set: {
          title: snapshot.title,
          description: snapshot.description,
          totalCredits: snapshot.totalCredits,
          modules: snapshot.modules,
          currentVersion: `v-restored-${versionDoc.version}`,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Curriculum restored to version ${versionDoc.version}`,
      data: restored,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error restoring version' });
  }
};

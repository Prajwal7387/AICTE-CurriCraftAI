import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { Curriculum } from '../models/Curriculum.model';
import { CurriculumVersion } from '../models/CurriculumVersion.model';

dotenv.config();

export const seedDatabase = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/curricraft_ai';
    console.log(`[Seed] Connecting to MongoDB: ${connStr}`);
    await mongoose.connect(connStr);

    console.log('[Seed] Clearing existing demo data...');
    await User.deleteMany({});
    await Curriculum.deleteMany({});
    await CurriculumVersion.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Dr. T. G. Sitharam',
      email: 'admin@aicte-india.org',
      passwordHash: commonPassword,
      role: 'ADMIN',
      department: 'AICTE Executive Directorate',
      institution: 'AICTE Headquarters, New Delhi',
    });

    const bureauHead = await User.create({
      name: 'Prof. Rajive Kumar',
      email: 'bureau@aicte-india.org',
      passwordHash: commonPassword,
      role: 'BUREAU_HEAD',
      department: 'Academic Policy & Curriculum Bureau',
      institution: 'AICTE Headquarters',
    });

    const expert = await User.create({
      name: 'Prof. Ananth R. Rao',
      email: 'expert@aicte-india.org',
      passwordHash: commonPassword,
      role: 'EXPERT',
      department: 'Computer Science & Engineering',
      institution: 'IIT Bombay / AICTE Expert Committee',
    });

    const reviewer = await User.create({
      name: 'Dr. Sunita Sharma',
      email: 'reviewer@aicte-india.org',
      passwordHash: commonPassword,
      role: 'REVIEWER',
      department: 'AI & Data Science Bureau',
      institution: 'AICTE Peer Review Panel',
    });

    await User.create({
      name: 'Public Guest Student',
      email: 'public@aicte-india.org',
      passwordHash: commonPassword,
      role: 'PUBLIC_VIEWER',
      department: 'General Public',
      institution: 'State Engineering College',
    });

    console.log('[Seed] Creating model curricula...');
    const cseCurriculum = await Curriculum.create({
      title: 'B.Tech Model Curriculum in Computer Science & Engineering',
      code: 'AICTE-CSE-2026',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      academicYear: '2026-2027',
      totalCredits: 160,
      status: 'PUBLISHED',
      description: 'National Unified Model Curriculum aligned with NEP 2020 guidelines, incorporating AI, Cloud, Cybersecurity, and Universal Human Values.',
      author: expert._id,
      reviewer: reviewer._id,
      nepComplianceScore: 94,
      nepDetails: {
        status: 'Fully Compliant',
        passedChecks: [
          'Total Credit Threshold (160 Credits)',
          'Universal Human Values (UHV-I & II)',
          'Mandatory Summer Industry Internship (6 Credits)',
          'Practical/Laboratory Ratio (32% of total hours)',
          'Multidisciplinary Open Electives',
        ],
        failedChecks: [],
        warnings: [],
        recommendations: ['Maintain annual review of AI micro-credentials.'],
      },
      currentVersion: 'v2.0',
      modules: [
        {
          id: 'mod_cse_101',
          title: 'Data Structures & Algorithmic Problem Solving',
          code: 'PCC-CS301',
          credits: 4,
          lectureHours: 3,
          tutorialHours: 0,
          practicalHours: 2,
          description: 'Fundamental data structures, asymptotic notation, trees, graph algorithms, and space-time tradeoffs.',
          topics: ['Arrays & Linked Lists', 'Stacks, Queues & Trees', 'Graph Algorithms & Dijkstra', 'Dynamic Programming'],
          learningOutcomes: [
            {
              id: 'lo_cse_1',
              description: 'Analyze time and space complexity of iterative and recursive algorithms.',
              bloomLevel: 'Analyze',
              assessmentMethod: 'Written Examination & Coding Lab',
            },
            {
              id: 'lo_cse_2',
              description: 'Implement complex graph structures to solve routing and optimization problems.',
              bloomLevel: 'Apply',
              assessmentMethod: 'Practical Laboratory Evaluation',
            },
          ],
        },
        {
          id: 'mod_cse_102',
          title: 'Artificial Intelligence & Machine Learning Architecture',
          code: 'PCC-CS501',
          credits: 4,
          lectureHours: 3,
          tutorialHours: 0,
          practicalHours: 2,
          description: 'Search algorithms, supervised/unsupervised learning, deep neural networks, and model deployment.',
          topics: ['Heuristic Search & Games', 'Supervised Learning & Regression', 'Neural Networks & PyTorch', 'Ethics in AI'],
          learningOutcomes: [
            {
              id: 'lo_cse_3',
              description: 'Formulate machine learning models to solve complex real-world predictive tasks.',
              bloomLevel: 'Create',
              assessmentMethod: 'Mini Project & Capstone',
            },
          ],
        },
        {
          id: 'mod_cse_103',
          title: 'Universal Human Values-II: Understanding Harmony',
          code: 'HSMC-UHV2',
          credits: 3,
          lectureHours: 2,
          tutorialHours: 1,
          practicalHours: 0,
          description: 'Mandatory AICTE NEP course on self-exploration, family harmony, society, and professional ethics.',
          topics: ['Process of Self-Exploration', 'Harmony in Self & Family', 'Professional Ethics in Engineering'],
          learningOutcomes: [
            {
              id: 'lo_cse_4',
              description: 'Examine moral and ethical dilemmas in technological development.',
              bloomLevel: 'Evaluate',
              assessmentMethod: 'Group Discussions & Reflective Essays',
            },
          ],
        },
      ],
    });

    // Create Version Snapshots
    await CurriculumVersion.create({
      curriculumId: cseCurriculum._id,
      version: 'v1.0',
      author: expert._id,
      message: 'Initial Draft submitted to AICTE Committee',
      snapshot: cseCurriculum.toObject(),
      tag: 'Draft Baseline',
    });

    await CurriculumVersion.create({
      curriculumId: cseCurriculum._id,
      version: 'v2.0',
      author: expert._id,
      message: 'Incorporated NEP 2020 feedback & published',
      snapshot: cseCurriculum.toObject(),
      tag: 'Approved Release',
    });

    console.log('[Seed] Demo data seeding completed successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Error]:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}

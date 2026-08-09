export interface NepCheckResult {
  name: string;
  category: 'Credits' | 'Mandatory Courses' | 'Electives' | 'Practical Ratio' | 'Multidisciplinary';
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
}

export interface NepComplianceReport {
  score: number;
  status: 'Fully Compliant' | 'Mostly Compliant' | 'Non-Compliant';
  passedCount: number;
  failedCount: number;
  warningCount: number;
  checks: NepCheckResult[];
  recommendations: string[];
}

export class NepService {
  static evaluateCurriculum(curriculum: any): NepComplianceReport {
    const checks: NepCheckResult[] = [];
    const recommendations: string[] = [];

    const totalCredits = curriculum.totalCredits || 0;
    const modules = curriculum.modules || [];

    // 1. Total Credit Rule (AICTE Standard: 160 credits for 4-year B.Tech)
    if (totalCredits >= 150 && totalCredits <= 170) {
      checks.push({
        name: 'Total Credit Threshold',
        category: 'Credits',
        status: 'PASS',
        message: `Total credits (${totalCredits}) fall within the AICTE recommended range of 150-170 credits.`,
      });
    } else if (totalCredits < 150) {
      checks.push({
        name: 'Total Credit Threshold',
        category: 'Credits',
        status: 'FAIL',
        message: `Total credits (${totalCredits}) are below the minimum AICTE benchmark of 150 credits.`,
      });
      recommendations.push('Add core or elective course modules to reach at least 150 credits.');
    } else {
      checks.push({
        name: 'Total Credit Threshold',
        category: 'Credits',
        status: 'WARNING',
        message: `Total credits (${totalCredits}) exceed the maximum suggested limit of 170 credits.`,
      });
      recommendations.push('Consider consolidating module credits to avoid student overload.');
    }

    // 2. Universal Human Values (UHV) & Ethics
    const hasUHV = modules.some((m: any) =>
      m.title.toLowerCase().includes('human values') ||
      m.title.toLowerCase().includes('uhv') ||
      m.description?.toLowerCase().includes('ethics')
    );
    if (hasUHV) {
      checks.push({
        name: 'Universal Human Values (UHV)',
        category: 'Mandatory Courses',
        status: 'PASS',
        message: 'Universal Human Values & Professional Ethics module identified in the curriculum.',
      });
    } else {
      checks.push({
        name: 'Universal Human Values (UHV)',
        category: 'Mandatory Courses',
        status: 'FAIL',
        message: 'Missing mandatory AICTE Universal Human Values (UHV-I / UHV-II) course.',
      });
      recommendations.push('Incorporate mandatory 3-credit course on Universal Human Values and Ethics.');
    }

    // 3. Internship & Industry Engagement
    const hasInternship = modules.some((m: any) =>
      m.title.toLowerCase().includes('internship') ||
      m.title.toLowerCase().includes('industrial training') ||
      m.description?.toLowerCase().includes('industry project')
    );
    if (hasInternship) {
      checks.push({
        name: 'Mandatory Industrial Internship',
        category: 'Mandatory Courses',
        status: 'PASS',
        message: 'Mandatory summer internship/industrial exposure credits detected.',
      });
    } else {
      checks.push({
        name: 'Mandatory Industrial Internship',
        category: 'Mandatory Courses',
        status: 'WARNING',
        message: 'No explicit Industrial Internship module found in course list.',
      });
      recommendations.push('Allocate minimum 4-6 credits for Summer Industry Internship / Industry Projects.');
    }

    // 4. Practical & Laboratory Credit Ratio
    let totalLectureHours = 0;
    let totalPracticalHours = 0;
    modules.forEach((m: any) => {
      totalLectureHours += m.lectureHours || 0;
      totalPracticalHours += m.practicalHours || 0;
    });

    const totalHours = totalLectureHours + totalPracticalHours;
    const practicalRatio = totalHours > 0 ? (totalPracticalHours / totalHours) * 100 : 0;

    if (practicalRatio >= 25) {
      checks.push({
        name: 'Practical / Laboratory Ratio',
        category: 'Practical Ratio',
        status: 'PASS',
        message: `Practical hands-on exposure accounts for ${practicalRatio.toFixed(1)}% of total contact hours (Target: ≥25%).`,
      });
    } else {
      checks.push({
        name: 'Practical / Laboratory Ratio',
        category: 'Practical Ratio',
        status: 'WARNING',
        message: `Practical exposure is ${practicalRatio.toFixed(1)}%, which is below the recommended 25% threshold.`,
      });
      recommendations.push('Increase practical laboratory contact hours for core modules.');
    }

    // 5. Skill Enhancement & Multidisciplinary Courses
    const hasSkillOrMulti = modules.some((m: any) =>
      m.title.toLowerCase().includes('skill') ||
      m.title.toLowerCase().includes('multidisciplinary') ||
      m.title.toLowerCase().includes('minor') ||
      m.title.toLowerCase().includes('open elective')
    );
    if (hasSkillOrMulti) {
      checks.push({
        name: 'Multidisciplinary & Skill Electives',
        category: 'Multidisciplinary',
        status: 'PASS',
        message: 'Multidisciplinary electives and skill-based courses integrated.',
      });
    } else {
      checks.push({
        name: 'Multidisciplinary & Skill Electives',
        category: 'Multidisciplinary',
        status: 'WARNING',
        message: 'Curriculum lacks explicit multidisciplinary open electives.',
      });
      recommendations.push('Introduce open electives from Humanities, Management, or Emerging Tech domains.');
    }

    // Scoring Logic
    const passedCount = checks.filter((c) => c.status === 'PASS').length;
    const warningCount = checks.filter((c) => c.status === 'WARNING').length;
    const failedCount = checks.filter((c) => c.status === 'FAIL').length;

    const score = Math.round(((passedCount * 1.0 + warningCount * 0.5) / checks.length) * 100);

    let status: 'Fully Compliant' | 'Mostly Compliant' | 'Non-Compliant' = 'Mostly Compliant';
    if (score >= 90 && failedCount === 0) status = 'Fully Compliant';
    else if (score < 60 || failedCount >= 2) status = 'Non-Compliant';

    return {
      score,
      status,
      passedCount,
      failedCount,
      warningCount,
      checks,
      recommendations,
    };
  }
}

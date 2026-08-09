export interface BloomDistribution {
  Remember: number;
  Understand: number;
  Apply: number;
  Analyze: number;
  Evaluate: number;
  Create: number;
}

export interface BloomAnalysisReport {
  distribution: BloomDistribution;
  dominantLevel: string;
  higherOrderThinkingRatio: number; // Ratio of Analyze + Evaluate + Create
  evaluationSummary: string;
  recommendations: string[];
}

export class BloomService {
  static analyzeOutcomes(outcomes: Array<{ description: string; bloomLevel?: string }>): BloomAnalysisReport {
    const counts: BloomDistribution = {
      Remember: 0,
      Understand: 0,
      Apply: 0,
      Analyze: 0,
      Evaluate: 0,
      Create: 0,
    };

    let total = outcomes.length;
    if (total === 0) {
      return {
        distribution: { Remember: 20, Understand: 30, Apply: 25, Analyze: 15, Evaluate: 5, Create: 5 },
        dominantLevel: 'Understand',
        higherOrderThinkingRatio: 25,
        evaluationSummary: 'No learning outcomes provided. Showing standard baseline distribution.',
        recommendations: ['Define explicit learning outcomes for each module using Bloom taxonomy action verbs.'],
      };
    }

    outcomes.forEach((out) => {
      const text = out.description.toLowerCase();
      const level = out.bloomLevel;

      if (level && counts[level as keyof BloomDistribution] !== undefined) {
        counts[level as keyof BloomDistribution] += 1;
      } else if (text.includes('design') || text.includes('formulate') || text.includes('create') || text.includes('develop')) {
        counts.Create += 1;
      } else if (text.includes('evaluate') || text.includes('assess') || text.includes('judge') || text.includes('critique')) {
        counts.Evaluate += 1;
      } else if (text.includes('analyze') || text.includes('compare') || text.includes('contrast') || text.includes('examine')) {
        counts.Analyze += 1;
      } else if (text.includes('apply') || text.includes('implement') || text.includes('solve') || text.includes('calculate')) {
        counts.Apply += 1;
      } else if (text.includes('explain') || text.includes('describe') || text.includes('understand') || text.includes('identify')) {
        counts.Understand += 1;
      } else {
        counts.Remember += 1;
      }
    });

    const percentages: BloomDistribution = {
      Remember: Math.round((counts.Remember / total) * 100),
      Understand: Math.round((counts.Understand / total) * 100),
      Apply: Math.round((counts.Apply / total) * 100),
      Analyze: Math.round((counts.Analyze / total) * 100),
      Evaluate: Math.round((counts.Evaluate / total) * 100),
      Create: Math.round((counts.Create / total) * 100),
    };

    const higherOrderCount = counts.Analyze + counts.Evaluate + counts.Create;
    const higherOrderThinkingRatio = Math.round((higherOrderCount / total) * 100);

    let dominantLevel = 'Understand';
    let maxCount = -1;
    (Object.keys(counts) as Array<keyof BloomDistribution>).forEach((lvl) => {
      if (counts[lvl] > maxCount) {
        maxCount = counts[lvl];
        dominantLevel = lvl;
      }
    });

    const recommendations: string[] = [];
    if (percentages.Remember > 30) {
      recommendations.push('High concentration of lower-order "Remember" level outcomes. Upgrade outcomes to "Apply" or "Analyze".');
    }
    if (higherOrderThinkingRatio < 30) {
      recommendations.push('Increase Higher-Order Thinking Skills (HOTS) by adding "Design", "Evaluate", or "Synthesize" objectives.');
    }
    if (percentages.Create < 10) {
      recommendations.push('Incorporate design-driven project outcomes corresponding to Bloom\'s "Create" level.');
    }

    return {
      distribution: percentages,
      dominantLevel,
      higherOrderThinkingRatio,
      evaluationSummary: `Curriculum outcome analysis demonstrates ${higherOrderThinkingRatio}% Higher-Order Thinking Skills (HOTS) focus, with dominant cognitive level '${dominantLevel}'.`,
      recommendations: recommendations.length > 0 ? recommendations : ['Curriculum displays a well-balanced cognitive progression across Bloom levels.'],
    };
  }
}

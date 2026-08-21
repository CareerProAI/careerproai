import { bandFromScore } from './band.js';
import { haltScore } from './halt.js';
import { scoreD1, scoreD2 } from './scoreFileLayout.js';
import { scoreD3, scoreD4 } from './scoreIdentity.js';
import { scoreD5, scoreD6 } from './scoreContent.js';
import { scoreD7, scoreD8 } from './scoreQualEvidence.js';
import { collectCaps } from './caps.js';
import { buildInsights } from './insights.js';

/** Template Method: halt → Strategy dimensions → sum → min(caps) → band. */
export function scoreUkAts(input = {}) {
  const text = String(input.text || '');
  const halted = haltScore(text);
  if (halted) {
    return {
      score: halted.score,
      atsCompatibility: bandFromScore(halted.score),
      dimensions: {},
      caps: [halted.score],
      halt: true,
      insights: {
        strengths: [],
        improvements: [{ title: 'Readable text', priority: 'High', description: 'Upload a text-based PDF or DOCX so UK ATS software can parse the file (D1).' }],
      },
    };
  }
  const ctx = { ...input, text };
  const dimensions = {
    d1: scoreD1(ctx), d2: scoreD2(ctx), d3: scoreD3(ctx), d4: scoreD4(ctx),
    d5: scoreD5(ctx), d6: scoreD6(ctx), d7: scoreD7(ctx), d8: scoreD8(ctx),
  };
  const raw = Object.values(dimensions).reduce((sum, n) => sum + n, 0);
  const caps = collectCaps(ctx, dimensions);
  const score = Math.max(0, Math.min(100, Math.round(Math.min(raw, ...caps))));
  return {
    score,
    atsCompatibility: bandFromScore(score),
    dimensions,
    caps,
    halt: false,
    insights: buildInsights(dimensions, ctx),
  };
}

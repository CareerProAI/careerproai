const LABELS = {
  d1: 'File & parseability',
  d2: 'Layout & typography',
  d3: 'Section structure',
  d4: 'Identity & contact',
  d5: 'Keywords & skills',
  d6: 'Work history',
  d7: 'Education & credentials',
  d8: 'Evidence quality',
};

const FIX = {
  d1: 'Export a text-based PDF or DOCX named Firstname-Lastname-CV (D1).',
  d2: 'Use a single column with no layout tables or icons (D2).',
  d3: 'Use UK headings: Professional Profile, Key Skills, Professional Experience, Education (D3).',
  d4: 'Put a UK phone (+44/07) and email in the body, not the header (D4).',
  d5: 'Add 8–16 advert-style skill phrases and evidence them in bullets (D5).',
  d6: 'Give every role month–year dates (MMM YYYY) in reverse chronological order (D6).',
  d7: 'State UK registration status (e.g. NMC registered) if the role is regulated (D7).',
  d8: 'Rewrite bullets as action + result with a number (D8).',
};

export function buildInsights(dimensions, ctx) {
  const entries = Object.entries(dimensions);
  const strengths = [...entries].sort((a, b) => b[1] - a[1]).slice(0, 3)
    .filter(([, v]) => v >= 8)
    .map(([k, v]) => ({ title: LABELS[k], description: `Scores ${v} on ${LABELS[k]} — parseable UK CV convention.` }));
  const improvements = [...entries].sort((a, b) => a[1] - b[1]).slice(0, 3)
    .filter(([, v]) => v < 14)
    .map(([k, v]) => ({
      title: LABELS[k],
      priority: v <= 2 || (k === 'd7' && v <= 2) ? 'High' : v < 8 ? 'Medium' : 'Low',
      description: FIX[k],
    }));
  if (/\b(nhs|civil service|local authorit)/i.test(`${ctx.text} ${ctx.jobDescription || ''}`)) {
    improvements[0] = improvements[0] || { title: 'Public sector form', priority: 'High', description: 'Pair this CV with STAR supporting statements against each essential criterion (D5/D8).' };
  }
  return { strengths: strengths.slice(0, 3), improvements: improvements.slice(0, 3) };
}

function asText(value, fallback = '') {
  if (typeof value === 'string') return value.trim() || fallback;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (value && typeof value === 'object') return asText(value.name || value.title, fallback);
  return fallback;
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return [value];
  if (value && typeof value === 'object') return Object.values(value);
  return [];
}

function datesFrom(exp) {
  const direct = asText(exp?.dates);
  if (direct) return direct;
  const range = [asText(exp?.startDate || exp?.start), asText(exp?.endDate || exp?.end)].filter(Boolean);
  return range.join(' - ') || 'Unknown dates';
}

function normalizeSkills(skills) {
  if (Array.isArray(skills)) return { tools: skills.map((s) => asText(s)).filter(Boolean) };
  if (!skills || typeof skills !== 'object') return {};
  return Object.fromEntries(
    Object.entries(skills).map(([category, list]) => [category, asList(list).map((s) => asText(s)).filter(Boolean)]),
  );
}

/** Coerce messy AI JSON into bind-safe strings/arrays so SQLite inserts cannot receive undefined. */
export function normalizeParsedResume(raw) {
  const data = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const score = Number(data.score);
  return {
    candidateName: asText(data.candidateName, 'Unknown Candidate'),
    currentRole: asText(data.currentRole, 'Software Professional'),
    contactInfo: Object.fromEntries(
      Object.entries(data.contactInfo || {}).map(([k, v]) => [k, asText(v)]).filter(([, v]) => v),
    ),
    score: Number.isFinite(score) ? Math.round(score) : 70,
    atsCompatibility: asText(data.atsCompatibility, 'Good ATS Compatibility'),
    strengths: asList(data.strengths).map((s) => ({ title: asText(s?.title, 'Strength'), description: asText(s?.description) })),
    improvements: asList(data.improvements).map((im) => ({
      title: asText(im?.title, 'Improvement'), priority: asText(im?.priority, 'Medium'), description: asText(im?.description),
    })),
    experience: asList(data.experience).map((exp) => ({
      role: asText(exp?.role, 'Unknown role'),
      company: asText(exp?.company, 'Unknown company'),
      dates: datesFrom(exp),
      bullets: asList(exp?.bullets).map((b) => asText(b)).filter(Boolean),
    })),
    education: asList(data.education).map((edu) => ({
      degree: asText(edu?.degree, 'Unknown degree'),
      institution: asText(edu?.institution, 'Unknown institution'),
      graduationYear: asText(edu?.graduationYear || edu?.year, 'Unknown'),
    })),
    skills: normalizeSkills(data.skills),
    certifications: asList(data.certifications)
      .map((cert) => ({ name: asText(cert?.name), institution: asText(cert?.institution), year: asText(cert?.year) }))
      .filter((cert) => cert.name),
    projects: asList(data.projects).map((proj) => ({
      title: asText(proj?.title, 'Untitled project'),
      description: asText(proj?.description, 'No description provided'),
      technologies: asList(proj?.technologies).map((t) => asText(t)).filter(Boolean),
      githubUrl: asText(proj?.githubUrl) || null,
      liveUrl: asText(proj?.liveUrl) || null,
    })),
    languages: asList(data.languages).map((lang) => ({
      name: asText(typeof lang === 'string' ? lang : lang?.name, 'Unknown'),
      proficiency: asText(typeof lang === 'string' ? '' : lang?.proficiency),
    })),
  };
}

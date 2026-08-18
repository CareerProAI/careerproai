import { reassembleResumeProfile } from './reassembleResumeProfile.js';

/** Load one resume from the same DB connection that just wrote it (Vercel /tmp is per-instance). */
export async function loadResumeProfile(db, id) {
  const resume = await db.get('SELECT * FROM resumes WHERE id = ?', id);
  if (!resume) return null;

  const [skills, experience, education, certifications, projects, languages, socialLinks, analysis] = await Promise.all([
    db.all('SELECT skill_name, category FROM resume_skills WHERE resume_id = ?', id),
    db.all('SELECT * FROM experience WHERE resume_id = ?', id),
    db.all('SELECT * FROM education WHERE resume_id = ?', id),
    db.all('SELECT * FROM certifications WHERE resume_id = ?', id),
    db.all('SELECT * FROM projects WHERE resume_id = ?', id),
    db.all('SELECT * FROM languages WHERE resume_id = ?', id),
    db.all('SELECT platform, url FROM social_links WHERE resume_id = ?', id),
    db.get('SELECT strengths, improvements FROM resume_analysis WHERE resume_id = ?', id),
  ]);

  return reassembleResumeProfile(resume, {
    skills, experience, education, certifications, projects, languages, socialLinks, analysis,
  });
}

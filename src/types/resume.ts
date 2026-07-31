export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  dates: string;
  bullets: string[];
}

export interface StrengthItem {
  id: string;
  title: string;
  description: string;
}

export interface ImprovementItem {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface SkillsMatrix {
  frameworks: string[];
  tools: string[];
  softSkills: string[];
}

export interface TargetRoleGap {
  targetRole: string;
  missingSkills: string[];
}

export interface ContactInfo {
  email: string | null;
  phone: string | null;
  address: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  graduationYear: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  institution: string | null;
  year: string | null;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string | null;
}

export interface ResumeProfile {
  id: string;
  fileName: string;
  candidateName: string;
  currentRole: string;
  score: number;
  atsCompatibility: string;
  strengths: StrengthItem[];
  improvements: ImprovementItem[];
  experience: ExperienceItem[];
  skills: SkillsMatrix;
  gapAnalysis: TargetRoleGap;
  lastAnalyzed: string;
  contactInfo?: ContactInfo;
  education?: EducationItem[];
  certifications?: CertificationItem[];
  projects?: ProjectItem[];
  languages?: LanguageItem[];
}

import { ResumeProfile } from '../../types';

export const sarahConnor: ResumeProfile = {
  id: 'profile-sarah',
  fileName: 'sarah_connor_frontend_staff_2026.pdf',
  candidateName: 'Sarah Connor',
  currentRole: 'Senior Frontend Engineer',
  score: 92,
  atsCompatibility: 'High ATS Compatibility',
  lastAnalyzed: 'Today, 10:45 AM',
  strengths: [
    { id: 's1', title: 'Strong Action Verbs', description: 'Excellent use of active language ("architected", "optimized", "spearheaded").' },
    { id: 's2', title: 'Quantified Achievements', description: '5 out of 7 roles include measurable impact metrics.' },
    { id: 's3', title: 'Keyword Density', description: 'High match rate for typical Senior React Engineer roles.' }
  ],
  improvements: [
    { id: 'i1', title: 'Formatting Consistency', priority: 'High', description: "Date formats vary between 'MM/YYYY' and 'Month YYYY'. Standardize for better ATS parsing." },
    { id: 'i2', title: 'Summary Length', priority: 'Medium', description: 'Professional summary is slightly long (5 sentences). Consider trimming to 3 impactful lines.' }
  ],
  experience: [
    {
      id: 'e1',
      role: 'Lead Frontend Engineer',
      company: 'TechNova Solutions',
      dates: '2021 - Present',
      bullets: [
        'Architected micro-frontend architecture using React and Webpack Module Federation, reducing initial load time by 40%.',
        'Mentored team of 5 junior developers and established code review guidelines.',
        'Spearheaded migration from REST to GraphQL, improving data fetching efficiency.'
      ]
    },
    {
      id: 'e2',
      role: 'Senior Web Developer',
      company: 'CreativeData Inc.',
      dates: '2018 - 2021',
      bullets: [
        'Developed responsive user interfaces for high-traffic e-commerce platforms using Vue.js.',
        'Implemented automated end-to-end testing with Cypress, achieving 85% coverage.'
      ]
    },
    { id: 'e3', role: 'Frontend Developer', company: 'Digital Dynamics', dates: '2015 - 2018', bullets: ['Details condensed for brevity.'] }
  ],
  skills: {
    frameworks: ['React', 'Next.js', 'Vue.js', 'Redux', 'GraphQL'],
    tools: ['TypeScript', 'Webpack', 'Jest', 'Cypress', 'Git'],
    softSkills: ['Mentorship', 'Architecture Planning', 'Agile/Scrum']
  },
  gapAnalysis: {
    targetRole: 'Staff Engineer',
    missingSkills: ['System Design', 'CI/CD Pipelines', 'Performance Auditing']
  },
  contactInfo: {
    email: 'sarah.connor@gmail.com',
    phone: '+1 (555) 019-2834',
    address: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/sarahconnor',
    github: 'https://github.com/sarahconnor',
    portfolio: 'https://sarahconnor.dev'
  },
  education: [{ id: 'edu-s1', degree: 'B.S. in Computer Science', institution: 'Stanford University', graduationYear: '2015' }],
  certifications: [{ id: 'cert-s1', name: 'AWS Certified Solutions Architect - Associate', institution: 'Amazon Web Services', year: '2023' }],
  projects: [
    {
      id: 'proj-s1',
      title: 'Micro-Frontend Core System',
      description: 'An open-source custom module federator library supporting runtime microservice composition.',
      technologies: ['React', 'Webpack', 'TypeScript', 'Docker'],
      githubUrl: 'https://github.com/sarahconnor/micro-core',
      liveUrl: 'https://micro-core-demo.dev'
    }
  ],
  languages: [
    { id: 'lang-s1', name: 'English', proficiency: 'Native' },
    { id: 'lang-s2', name: 'Spanish', proficiency: 'Conversational' }
  ]
};

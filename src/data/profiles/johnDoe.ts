import { ResumeProfile } from '../../types';

export const johnDoe: ResumeProfile = {
  id: 'profile-john',
  fileName: 'john_doe_fullstack_web_2025.docx',
  candidateName: 'John Doe',
  currentRole: 'Full Stack Developer',
  score: 72,
  atsCompatibility: 'Moderate ATS Compatibility',
  lastAnalyzed: '5 days ago',
  strengths: [
    { id: 'js1', title: 'Versatility', description: 'Equally comfortable with frontend frameworks (React) and backend services (Node, Postgres).' }
  ],
  improvements: [
    { id: 'ji1', title: 'Quantified Impact', priority: 'High', description: 'Many bullet points describe responsibilities rather than achievements. Add metrics to demonstrate value.' }
  ],
  experience: [
    {
      id: 'je1',
      role: 'Full Stack Developer',
      company: 'SaaS Startups LLC',
      dates: '2022 - Present',
      bullets: [
        'Built full stack applications using React, Express, and PostgreSQL.',
        'Integrated third-party APIs including Stripe, SendGrid, and Firebase.'
      ]
    }
  ],
  skills: {
    frameworks: ['React', 'Node.js', 'Express', 'TailwindCSS'],
    tools: ['PostgreSQL', 'Docker', 'AWS', 'Git', 'REST APIs'],
    softSkills: ['Adaptability', 'Speed Coding', 'Customer Focus']
  },
  gapAnalysis: {
    targetRole: 'Senior Full Stack Architect',
    missingSkills: ['Microservices Design', 'Redis Caching', 'GraphQL Federations']
  },
  contactInfo: {
    email: 'john.doe@gmail.com',
    phone: '+1 (555) 012-3456',
    address: 'Austin, TX',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.com'
  },
  education: [{ id: 'edu-j1', degree: 'B.A. in Interactive Design & Coding', institution: 'University of Texas at Austin', graduationYear: '2022' }],
  certifications: [{ id: 'cert-j1', name: 'Full Stack Open Web Developer Certification', institution: 'University of Helsinki', year: '2021' }],
  projects: [
    {
      id: 'proj-j1',
      title: 'SaaS Multi-Tenant Boilerplate',
      description: 'A standard starter kit for building multi-tenant SaaS applications with Postgres and Stripe.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      githubUrl: 'https://github.com/johndoe/saas-boilerplate',
      liveUrl: 'https://saas-boilerplate-demo.com'
    }
  ],
  languages: [{ id: 'lang-j1', name: 'English', proficiency: 'Native' }]
};

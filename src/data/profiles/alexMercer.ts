import { ResumeProfile } from '../../types';

export const alexMercer: ResumeProfile = {
  id: 'profile-alex',
  fileName: 'Alex_CV_AI_Engineer_2024.pdf',
  candidateName: 'Alex Mercer',
  currentRole: 'Senior ML / AI Specialist',
  score: 85,
  atsCompatibility: 'Good ATS Compatibility',
  lastAnalyzed: 'Yesterday, 3:15 PM',
  strengths: [
    { id: 'as1', title: 'Cutting-Edge AI Expertise', description: 'Strong projects involving modern LLMs, Transformers, and deep learning architectures.' },
    { id: 'as2', title: 'Scalable Infrastructure', description: 'Extensive work with cloud platforms (GCP, AWS) and containerization tools (Docker, K8s).' }
  ],
  improvements: [
    { id: 'ai1', title: 'Missing Certifications', priority: 'Medium', description: 'Listing GCP Machine Learning Engineer or AWS ML Specialty could increase interview rates by 15%.' },
    { id: 'ai2', title: 'CV Layout', priority: 'Low', description: 'Using double columns can occasionally trip older parser tools. Single-column layouts are safer.' }
  ],
  experience: [
    {
      id: 'ae1',
      role: 'Senior AI Engineer',
      company: 'Google',
      dates: '2022 - Present',
      bullets: [
        'Designed and fine-tuned Transformer-based models for enterprise semantic searches, enhancing search precision by 25%.',
        'Collaborated on cloud scaling strategies for deploying multi-billion parameter foundation models.'
      ]
    },
    {
      id: 'ae2',
      role: 'Machine Learning Lead',
      company: 'Stripe',
      dates: '2019 - 2022',
      bullets: [
        'Spearheaded development of fraud-detection algorithms with an accuracy rate of 99.8%.',
        'Optimized inference pipelines reducing API latency by 80ms.'
      ]
    }
  ],
  skills: {
    frameworks: ['TensorFlow', 'PyTorch', 'Python', 'Jupyter', 'Keras'],
    tools: ['Docker', 'Kubernetes', 'GCP', 'SQL', 'Git'],
    softSkills: ['Cross-functional Collaboration', 'Technical Speaking', 'Problem Solving']
  },
  gapAnalysis: {
    targetRole: 'Principal AI Architect',
    missingSkills: ['Distributed Training Scaling', 'Mangement of Multi-GPU Clusters', 'Model Quantization']
  },
  contactInfo: {
    email: 'alex.mercer@gmail.com',
    phone: '+1 (555) 045-8831',
    address: 'Mountain View, CA',
    linkedin: 'https://linkedin.com/in/alexmercer-ai',
    github: 'https://github.com/alexmercer-ai',
    portfolio: 'https://alexmercer.ai'
  },
  education: [{ id: 'edu-a1', degree: 'M.S. in Artificial Intelligence', institution: 'Carnegie Mellon University', graduationYear: '2019' }],
  certifications: [{ id: 'cert-a1', name: 'Google Cloud Certified Professional Machine Learning Engineer', institution: 'Google Cloud', year: '2024' }],
  projects: [
    {
      id: 'proj-a1',
      title: 'Enterprise LLM Search Fine-Tuning',
      description: 'Custom fine-tuning setup for open-weights LLMs for fast semantic enterprise queries.',
      technologies: ['PyTorch', 'HuggingFace', 'Kubernetes', 'GCP'],
      githubUrl: 'https://github.com/alexmercer-ai/llm-finetuning',
      liveUrl: null
    }
  ],
  languages: [
    { id: 'lang-a1', name: 'English', proficiency: 'Native' },
    { id: 'lang-a2', name: 'German', proficiency: 'Conversational' }
  ]
};

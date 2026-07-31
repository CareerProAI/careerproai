export interface Application {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  appliedDate: string;
  appliedAt: string;
  status: 'Applied' | 'Screening' | 'Interviewing' | 'Offered' | 'Rejected';
  notes?: string;
}

export interface ActivityLog {
  id: string;
  text: string;
  time: string;
}

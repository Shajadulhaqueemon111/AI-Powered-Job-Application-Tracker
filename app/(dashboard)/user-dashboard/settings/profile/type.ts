export type ExperienceLevel = "Junior" | "Mid" | "Senior";

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Internship"
  | "Contract"
  | "Freelance";

export type JobType = "Remote" | "Hybrid" | "On-site";

export type ProficiencyLevel = "Basic" | "Conversational" | "Fluent" | "Native";

export interface Language {
  id: string;
  name: string;
  proficiency: ProficiencyLevel;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  employmentType: EmploymentType;
  startDate: string; // ISO date
  endDate: string | null; // null = currently working here
  isCurrent: boolean;
  responsibilities: string;
  achievements: string;
}

export interface Education {
  id: string;
  degree: string;
  institutionName: string;
  subject: string;
  passingYear: string;
  cgpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologiesUsed: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface JobPreferences {
  expectedSalary?: string;
  currentSalary?: string;
  noticePeriod?: string;
  preferredJobType?: EmploymentType;
  preferredLocation?: string;
  willingToRelocate: boolean;
  workMode?: JobType;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
  phoneNumber?: string;
  address?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  status?: string;
  twoFactorEnabled?: boolean;

  summary?: string;
  experienceLevel?: ExperienceLevel;
  careerObjective?: string;

  skills?: string[];
  languages?: Language[];

  experience?: WorkExperience[];
  education?: Education[];
  projects?: Project[];
  certifications?: Certification[];

  resumeUrl?: string;
  resumeFileName?: string;

  jobPreferences?: JobPreferences;

  notificationSettings?: {
    emailAlerts: boolean;
    jobAlerts: boolean;
    interviewReminders: boolean;
  };

  profileCompleteness?: number;
}

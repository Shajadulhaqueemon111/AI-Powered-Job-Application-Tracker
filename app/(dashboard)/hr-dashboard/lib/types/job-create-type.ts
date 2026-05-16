export type JobForm = {
  title: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
  };
  location: string;
  workType: string;
  employmentType: string;
  experienceLevel: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;

  skills: { value: string }[];
  responsibilities: { value: string }[];
  requirements: { value: string }[];
  benefits: { value: string }[];

  applicationDeadline: string;
  status: string;
  createdBy: string;
};

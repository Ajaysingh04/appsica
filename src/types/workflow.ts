export interface IWorkflowStep {
  _id?: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  details: string[];
  order?: number;
}

export interface ISuccessProject {
  name: string;
  tech: string;
  rating: string;
  image: string;
}

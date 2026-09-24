export interface IContactFormInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  projectName?: string;
  project?: string;
  source?: string;
}

export interface IContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}

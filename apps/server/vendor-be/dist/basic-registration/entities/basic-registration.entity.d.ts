import { SecurityQuestion } from './security-question.entity';
export declare class BasicRegistration {
  id: string;
  superTokenUserId: string;
  email: string;
  phoneNumber: string;
  alternativeEmail: string;
  name: string;
  formOfBusiness: string;
  companyOrigin: string;
  district: string;
  country: string;
  securityQuestions: SecurityQuestion[];
}

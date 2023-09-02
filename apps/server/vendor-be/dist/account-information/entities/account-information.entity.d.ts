import { BasicRegistration } from './basic-registration.entity';
import { SecurityQuestion } from './security-question.entity';
export declare class AccountInformation {
  id: string;
  superTokenUserId: string;
  email: string;
  phoneNumber: string;
  alternativeEmail: string;
  basicRegistration: BasicRegistration;
  securityQuestions: SecurityQuestion[];
}

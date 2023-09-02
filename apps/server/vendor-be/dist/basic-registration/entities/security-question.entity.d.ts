import { BasicRegistration } from './basic-registration.entity';
export declare class SecurityQuestion {
  id: string;
  question: string;
  answer: string;
  basicRegistrationId: string;
  basicRegistration: BasicRegistration;
}

import { Audit } from 'src/shared/entities/audit.entity';
import { Organization } from './organization.entity';
import { SecurityQuestion } from "./security-question.entity";
export declare class Employee extends Audit {
    id: string;
    superTokenUserId: string;
    username: string;
    firstName: string;
    lastName: string;
    organizationId: string;
    organization: Organization;
    securityQuestions: SecurityQuestion[];
}

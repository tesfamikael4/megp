import { Audit } from 'src/shared/entities/audit.entity';
import { Employee } from './employee.entity';
export declare class SecurityQuestion extends Audit {
  id: string;
  question: string;
  answer: string;
  employeeId: string;
  employee: Employee;
}

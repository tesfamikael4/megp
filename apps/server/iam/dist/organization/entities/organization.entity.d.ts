import { Audit } from 'src/shared/entities/audit.entity';
import { Unit } from './unit.entity';
import { Employee } from './employee.entity';
export declare class Organization extends Audit {
    id: string;
    name: string;
    code: string;
    type: string;
    units: Unit[];
    employees: Employee[];
}

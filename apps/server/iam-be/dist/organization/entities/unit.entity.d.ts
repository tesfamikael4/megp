import { Audit } from 'src/shared/entities/audit.entity';
import { Organization } from './organization.entity';
export declare class Unit extends Audit {
  id: string;
  name: string;
  parentId: string;
  organizationId: string;
  organization: Organization;
}

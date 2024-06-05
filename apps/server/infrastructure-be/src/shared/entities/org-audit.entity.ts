import { Audit } from 'megp-shared-be';
import { Column } from 'typeorm';

export class OrgAudit extends Audit {
  @Column({ type: 'uuid', nullable: true })
  public organizationId: string;
}

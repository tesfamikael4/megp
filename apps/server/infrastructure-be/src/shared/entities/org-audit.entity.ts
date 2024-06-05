import { Audit } from 'megp-shared-be';
import { Column } from 'typeorm';

export class OrgAudit extends Audit {
  @Column({ type: 'uuid' })
  public organizationId: string;

  @Column()
  public organizationName: string;
}

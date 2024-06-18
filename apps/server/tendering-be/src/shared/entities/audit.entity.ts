import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Audit {
  @Column({ default: 0 })
  public tenantId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  public deletedAt!: Date;
}

export class OrgAudit extends Audit {
  @Column({ type: 'uuid' })
  public organizationId: string;

  @Column()
  public organizationName: string;
}

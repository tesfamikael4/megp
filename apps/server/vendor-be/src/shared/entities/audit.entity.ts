import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Audit {
  @Column({ default: 0 })
  public tenantId: number;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}

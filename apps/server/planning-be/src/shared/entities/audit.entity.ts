import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Audit {
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}

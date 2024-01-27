import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Permission } from './permission.entity';

@Entity({ name: 'applications' })
export class Application extends Audit {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  key: string;

  @OneToMany(() => Permission, (permissions) => permissions.application, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  permissions: Permission[];
}

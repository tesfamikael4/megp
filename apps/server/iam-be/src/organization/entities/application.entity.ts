import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Permission } from './permission.entity';

@Entity({ name: 'applications' })
export class Application extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  key: string;

  @Column()
  organizationId: string;

  @OneToMany(() => Permission, (permission) => permission.application, {
    cascade: true,
  })
  permissions: Permission[];
}

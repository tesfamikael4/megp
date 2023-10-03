import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Mandate } from './mandate.entity';
import { Permission } from 'src/application/entities/permission.entity';

@Entity({ name: 'mandate_permission_news' })
export class MandatePermission extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mandateId: string;

  @ManyToOne(() => Mandate, (mandate) => mandate.mandatePermissions)
  @JoinColumn({ name: 'mandateId' })
  public mandate: Mandate;

  @Column()
  permissionId: string;

  @ManyToOne(() => Permission, (permission) => permission.mandatePermissions)
  @JoinColumn({ name: 'permissionId' })
  public permission: Permission;

  @Column()
  applicationId: string;

  @Column()
  applicationKey: string;

  @Column()
  permissionKey: string;
}

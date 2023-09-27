import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from '../../shared/entities/audit.entity';
import { Unit } from './unit.entity';
import { User } from './employee.entity';

@Entity({ name: 'user_units' })
export class UserUnit extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  unitId: string;

  @Column()
  userId: string;

  @Column()
  unitName: string;

  @ManyToOne(() => Unit, (unit) => unit.userUnits, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  public unit: Unit;

  @ManyToOne(() => User, (user) => user.userUnits, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  public user: User;
}

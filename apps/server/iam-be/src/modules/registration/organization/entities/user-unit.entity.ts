import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { Unit } from './unit.entity';
import { User } from './user.entity';

@Entity({ name: 'user_units' })
export class UserUnit extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  unitId: string;

  @Column()
  userId: string;

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

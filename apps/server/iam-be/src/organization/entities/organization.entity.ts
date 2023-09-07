import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { Unit } from './unit.entity';
import { Employee } from './employee.entity';
import { Office } from './office.entity';

@Entity({ name: 'organizations' })
export class Organization extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  type: string;

  @Column()
  budgetType: string;

  @Column('boolean', { default: false })
  isActive: boolean;

  @OneToMany(() => Unit, (unit) => unit.organization, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  units: Unit[];

  @OneToMany(() => Employee, (employee) => employee.organization, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  employees: Employee[];

  @OneToMany(() => Office, (office) => office.organization, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  offices: Office[];
}

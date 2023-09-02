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
} from "typeorm";

import { Audit } from 'src/shared/entities/audit.entity';

import { Unit } from './unit.entity';
   import { Employee } from './employee.entity';
    

@Entity({ name: "organizations" })
export class Organization extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
   
  @Column()
  name: string;
  
  @Column()
  code: string;
  
  @Column()
  type: string;
  
  @OneToMany(
    () => Unit,
    (unit) => unit.organization,
    {
      cascade: true,
      onDelete: "CASCADE"
    },
  )
  units: Unit[];
  
  @OneToMany(
    () => Employee,
    (employee) => employee.organization,
    {
      cascade: true,
      onDelete: "CASCADE"
    },
  )
  employees: Employee[];
  
  }
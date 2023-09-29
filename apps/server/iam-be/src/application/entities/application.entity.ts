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

import { Permission } from './permission.entity';


@Entity({ name: "applications" })
export class Application extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => Permission,
    (permissions) => permissions.application,
    {
      cascade: true,
      onDelete: "CASCADE"
    },
  )
  permissions: Permission[];

}
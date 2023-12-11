import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { APP } from './app.entity';

@Entity({ name: 'budget' })
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coa: string;

  @Column()
  description: string;

  @Column()
  fundingSource: string;

  @Column()
  allocatedBudget: number;

  @Column()
  plannedValue: number;

  @Column()
  balance: number;

  @Column()
  currency: string;

  @Column()
  type: string;

  @Column()
  appId: string;

  @ManyToOne(() => APP, (app) => app.budgets)
  @JoinColumn({ name: 'appId' })
  public app: APP;
}

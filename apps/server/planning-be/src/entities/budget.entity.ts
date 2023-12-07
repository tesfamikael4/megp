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
  allocatedBudget: string;

  @Column()
  plannedValue: string;

  @Column()
  balance: string;

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

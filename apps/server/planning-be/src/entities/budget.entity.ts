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

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  fundingSource: string[];

  @Column({ type: 'bigint' })
  allocatedBudget: number;

  @Column({ type: 'bigint' })
  plannedValue: number;

  @Column({ type: 'bigint' })
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

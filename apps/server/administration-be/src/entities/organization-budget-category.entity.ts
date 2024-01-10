import { Audit } from 'src/shared/entities';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'organization_budget_category' })
export class OrganizationBudgetCategory extends Audit {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;
}

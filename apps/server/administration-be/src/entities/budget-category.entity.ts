import { Audit } from '@audit';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrganizationBudgetCategory } from './organization-budget-category.entity';

@Entity({ name: 'budget_categories' })
export class BudgetCategory extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;

  @OneToMany(
    () => OrganizationBudgetCategory,
    (organizationBudgetCategory) => organizationBudgetCategory.budgetCategory,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  organizationBudgetCategory: OrganizationBudgetCategory[];
}

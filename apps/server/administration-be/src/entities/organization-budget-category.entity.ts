import { Audit } from 'src/shared/entities';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BudgetCategory } from './budget-category.entity';
@Entity({ name: 'organization_budget_category' })
export class OrganizationBudgetCategory extends Audit {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  organizationId: string;

  @Column()
  budgetCategoryId: string;

  @ManyToOne(
    () => BudgetCategory,
    (budgetCategory) => budgetCategory.organizationBudgetCategory,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  public budgetCategory: BudgetCategory;
}

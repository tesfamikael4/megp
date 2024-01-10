// import { Audit } from 'src/shared/entities';
// import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { OrganizationBudgetCategory } from './organization-budget-category.entity';
// @Entity({ name: 'organization' })
// export class Organization extends Audit {
//   @PrimaryGeneratedColumn()
//   id: string;

//   @Column()
//   name: string;

//   @OneToMany(
//     () => OrganizationBudgetCategory,
//     (organizationBudgetCategory) => organizationBudgetCategory.budgetCategory,
//     {
//       cascade: true,
//       onDelete: 'CASCADE',
//     },
//   )
//   organizationBudgetCategory: OrganizationBudgetCategory[];
// }

// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   OneToOne,
//   OneToMany,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';

// import { PostBudgetPlanActivity } from './post-budget-plan-activity.entity';
// import { OrgAudit } from 'src/shared/entities';

// @Entity({ name: 'post_budget_plan_framework_contracts' })
// export class PostBudgetPlanFrameworkContract extends OrgAudit{
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   postBudgetPlanActivityId: string;

//   @ManyToOne(
//     () => PostBudgetPlanActivity,
//     (postBudgetPlanActivity) =>
//       postBudgetPlanActivity.postBudgetPlanFrameworkContracts,
//   )
//   @JoinColumn({ name: 'postBudgetPlanActivityId' })
//   public postBudgetPlanActivity: PostBudgetPlanActivity;

//   @Column()
//   contractName: string;

//   @Column()
//   contractNumber: string;

//   @Column()
//   agreement: string;
// }

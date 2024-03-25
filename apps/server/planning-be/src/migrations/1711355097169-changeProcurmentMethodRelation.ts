import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeProcurmentMethodRelation1711355097169
  implements MigrationInterface
{
  name = 'ChangeProcurmentMethodRelation1711355097169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_requisitioners" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_requisitioners" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hash" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_requisitioners" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" DROP CONSTRAINT "FK_ae8b9786dfaa7518966ba6dfd66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" ADD CONSTRAINT "UQ_ae8b9786dfaa7518966ba6dfd66" UNIQUE ("preBudgetPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_requisitioners" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" DROP CONSTRAINT "FK_a4bec97b4fbe8f711d190e9ad61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" ADD CONSTRAINT "UQ_a4bec97b4fbe8f711d190e9ad61" UNIQUE ("postBudgetPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "UQ_0f4c3d64833f192fd6005e3d787"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hash" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "UQ_0f4c3d64833f192fd6005e3d787" UNIQUE ("organizationId", "itemCode", "deletedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" ADD CONSTRAINT "FK_ae8b9786dfaa7518966ba6dfd66" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" ADD CONSTRAINT "FK_a4bec97b4fbe8f711d190e9ad61" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" DROP CONSTRAINT "FK_a4bec97b4fbe8f711d190e9ad61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" DROP CONSTRAINT "FK_ae8b9786dfaa7518966ba6dfd66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "UQ_0f4c3d64833f192fd6005e3d787"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "hash" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "UQ_0f4c3d64833f192fd6005e3d787" UNIQUE ("deletedAt", "organizationId", "itemCode")`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" DROP CONSTRAINT "UQ_a4bec97b4fbe8f711d190e9ad61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" ADD CONSTRAINT "FK_a4bec97b4fbe8f711d190e9ad61" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_requisitioners" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" DROP CONSTRAINT "UQ_ae8b9786dfaa7518966ba6dfd66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" ADD CONSTRAINT "FK_ae8b9786dfaa7518966ba6dfd66" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_requisitioners" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hash" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_requisitioners" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_requisitioners" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP COLUMN "organizationName"`,
    );
  }
}

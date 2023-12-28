import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrgAudit1703749282935 implements MigrationInterface {
  name = 'OrgAudit1703749282935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "FK_09180d611e035643f5788d385ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "UQ_09180d611e035643f5788d385ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "budget_year"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "budgetYearName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "budget" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "budget" ADD "organizationId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "budgetYear" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ADD "organizationId" uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "budgetYear"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "tenantId"`);
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "budgetYearName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "budget_year" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "UQ_09180d611e035643f5788d385ff" UNIQUE ("budget_year")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "FK_09180d611e035643f5788d385ff" FOREIGN KEY ("budget_year") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

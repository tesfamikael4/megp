import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAPP1706200441306 implements MigrationInterface {
  name = 'AddAPP1706200441306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "requisitioner_assignments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid NOT NULL, "annualProcurementPlanActivityId" uuid NOT NULL, CONSTRAINT "PK_f4e0d61d64df0fd9930b3596a41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fundingSource" character varying, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "donor" character varying NOT NULL, "targetGroup" jsonb NOT NULL, "isOnline" boolean NOT NULL DEFAULT false, "contract" jsonb NOT NULL, "annualProcurementPlanId" uuid NOT NULL, CONSTRAINT "PK_8685ab6b89ae9fe4d5319ab84ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "annual_procurement_plans" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization" jsonb NOT NULL, "name" character varying NOT NULL, "description" character varying, "budgetYear" jsonb NOT NULL, "status" character varying NOT NULL DEFAULT 'Draft', CONSTRAINT "PK_0d9e9384953ccbee03e5cdd5934" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "annual_procurement_plan_timelines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timeline" character varying NOT NULL, "order" integer NOT NULL, "noOfDays" double precision NOT NULL, "dueDate" TIMESTAMP NOT NULL, "annualProcurementPlanActivityId" uuid NOT NULL, CONSTRAINT "PK_b7adcfb869fd34238ad108d5806" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "annual_procurement_plan_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemCode" character varying NOT NULL, "description" character varying NOT NULL, "unitPrice" double precision NOT NULL DEFAULT '0', "quantity" double precision NOT NULL DEFAULT '0', "classification" character varying, "measurement" character varying NOT NULL, "uoM" character varying NOT NULL, "annualProcurementPlanActivityId" uuid NOT NULL, CONSTRAINT "PK_5e5ac55cd321abbee30c1d904b1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "annual_procurement_plan_disbursements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quarter" character varying NOT NULL, "order" integer NOT NULL, "amount" double precision NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "annualProcurementPlanActivityId" uuid NOT NULL, "budgetYear" jsonb NOT NULL, CONSTRAINT "PK_6adb645fa1ec988207ea11b113c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "annual_procurement_plan_activities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanId" uuid NOT NULL, "procurementReferenceNumber" character varying NOT NULL, "activityName" character varying NOT NULL, "description" character varying, "estimatedAmount" double precision NOT NULL DEFAULT '0', "calculatedAmount" double precision NOT NULL DEFAULT '0', "currency" character varying NOT NULL DEFAULT 'USD', "status" character varying NOT NULL DEFAULT 'Draft', "isMultipleYear" boolean NOT NULL DEFAULT false, "remark" character varying, "classification" jsonb, "annualProcurementPlanId" uuid NOT NULL, CONSTRAINT "PK_3aaaa49784366e48370eecbf950" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "annual_procurement_plan_budget_lines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "budgetCode" character varying NOT NULL, "procurementRequisitionId" uuid NOT NULL, "fundingSource" double precision NOT NULL DEFAULT '0', "amount" double precision NOT NULL DEFAULT '0', "budgetYear" character varying NOT NULL, "currency" character varying NOT NULL, "annualProcurementPlanActivityId" uuid NOT NULL, CONSTRAINT "PK_aa9daa06d59c034e459a87cd668" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "annual_procurement_plan_budget_lines"`,
    );
    await queryRunner.query(`DROP TABLE "annual_procurement_plan_activities"`);
    await queryRunner.query(
      `DROP TABLE "annual_procurement_plan_disbursements"`,
    );
    await queryRunner.query(`DROP TABLE "annual_procurement_plan_items"`);
    await queryRunner.query(`DROP TABLE "annual_procurement_plan_timelines"`);
    await queryRunner.query(`DROP TABLE "annual_procurement_plans"`);
    await queryRunner.query(`DROP TABLE "procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "requisitioner_assignments"`);
  }
}

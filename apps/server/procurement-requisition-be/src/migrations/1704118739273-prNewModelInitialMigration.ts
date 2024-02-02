import { MigrationInterface, QueryRunner } from 'typeorm';

export class PrNewModelInitialMigration1704118739273
  implements MigrationInterface
{
  name = 'PrNewModelInitialMigration1704118739273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP CONSTRAINT "FK_c0184be189b8463828d5833a795"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "FK_2fef51181a2a512503ed7b57ff8"`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying NOT NULL, "fileType" character varying NOT NULL, "bucketName" character varying NOT NULL, "originalName" character varying NOT NULL, "documentUrl" character varying, "path" character varying NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_11c1eca15125e2ef20bdefc2979" UNIQUE ("fileName"), CONSTRAINT "PK_9c166d52ffb1af4db4ceb248318" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_timelines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timeline" jsonb NOT NULL, "order" integer NOT NULL, "noOfDays" double precision NOT NULL, "dueDate" TIMESTAMP NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "REL_2a6c4b46c333e2320278bad734" UNIQUE ("procurementRequisitionId"), CONSTRAINT "PK_d3f71f6b05ee1e054b474385134" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_officer_assignments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "PK_8189a81cc85645ca4fa33a4ff60" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_item_references" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "procurementRequisitionItemId" uuid NOT NULL, "annualProcurementPlanItemId" uuid NOT NULL, CONSTRAINT "PK_0e9293be6ef827f5a40dcd7cc4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL, "itemCode" character varying NOT NULL, "description" character varying NOT NULL, "unitPrice" double precision NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "quantity" double precision NOT NULL DEFAULT '0', "measurement" character varying NOT NULL, "classification" character varying NOT NULL, "uoM" character varying NOT NULL, "annualProcurementPlanBudgetLineId" uuid, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_9449b64bf0d34d6f457b5c083fa" UNIQUE ("procurementRequisitionId", "itemCode"), CONSTRAINT "PK_f229fd2ab23693583f54e88df26" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "procurementRequisitionId" uuid NOT NULL, "fundingSource" text NOT NULL, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "donor" jsonb NOT NULL, "targetGroup" jsonb NOT NULL, "isOnline" boolean NOT NULL DEFAULT true, "contract" jsonb NOT NULL, CONSTRAINT "REL_f0918c5387a823cd811ed0caec" UNIQUE ("procurementRequisitionId"), CONSTRAINT "PK_3497722978c390e4c872edf8a1a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_disbursements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quarter" character varying NOT NULL, "order" integer NOT NULL, "amount" double precision NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "procurementRequisitionId" uuid NOT NULL, "budgetYear" jsonb NOT NULL, CONSTRAINT "PK_c448bdbb9180786cab632865053" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_budget_lines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "procurementRequisitionId" uuid NOT NULL, "annualProcurementPlanBudgetLineId" uuid NOT NULL, "amount" double precision NOT NULL DEFAULT '0', CONSTRAINT "PK_2cdfb8e526abcaddfe53938ce22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP COLUMN "postBudgetPlanActivityId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "referenceNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "postBudgetPlanId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD "annualProcurementPlanActivityId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD CONSTRAINT "UQ_e13d8b4828d3e24df1220a0143a" UNIQUE ("annualProcurementPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD "annualProcurementPlan" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "organization" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "requisitionReferenceNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "UQ_66a974e7f8b5b3a5769ff7d1b74" UNIQUE ("requisitionReferenceNumber")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "userReferenceNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "UQ_1694cc3ae4a896347550d9bf6c9" UNIQUE ("userReferenceNumber")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "budgetYear" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "calculatedAmount" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "currency" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "totalEstimatedAmount" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "status" SET DEFAULT 'Draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "UQ_db94e8e7549b25864e2534909d1" UNIQUE ("userReferenceNumber", "requisitionReferenceNumber")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" ADD CONSTRAINT "FK_927692bdb26c6df5886dd3b25f2" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD CONSTRAINT "FK_2a6c4b46c333e2320278bad7340" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_officer_assignments" ADD CONSTRAINT "FK_53da30deab7754da9706402bd13" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "FK_6f8554407c58ad45931f91fcdc1" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_mechanisms" ADD CONSTRAINT "FK_f0918c5387a823cd811ed0caec4" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_disbursements" ADD CONSTRAINT "FK_4a34b284062acaa3c7526441b69" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_budget_lines" ADD CONSTRAINT "FK_8a3807df41b4ff8153ed95c4b82" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_budget_lines" DROP CONSTRAINT "FK_8a3807df41b4ff8153ed95c4b82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_disbursements" DROP CONSTRAINT "FK_4a34b284062acaa3c7526441b69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_mechanisms" DROP CONSTRAINT "FK_f0918c5387a823cd811ed0caec4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "FK_6f8554407c58ad45931f91fcdc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_officer_assignments" DROP CONSTRAINT "FK_53da30deab7754da9706402bd13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP CONSTRAINT "FK_2a6c4b46c333e2320278bad7340"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" DROP CONSTRAINT "FK_927692bdb26c6df5886dd3b25f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "UQ_db94e8e7549b25864e2534909d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "totalEstimatedAmount" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "budgetYear"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "UQ_1694cc3ae4a896347550d9bf6c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "userReferenceNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "UQ_66a974e7f8b5b3a5769ff7d1b74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "requisitionReferenceNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "organization"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP COLUMN "annualProcurementPlan"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP CONSTRAINT "UQ_e13d8b4828d3e24df1220a0143a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP COLUMN "annualProcurementPlanActivityId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "postBudgetPlanId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "referenceNumber" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD "postBudgetPlanActivityId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `DROP TABLE "procurement_requisition_budget_lines"`,
    );
    await queryRunner.query(
      `DROP TABLE "procurement_requisition_disbursements"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_requisition_mechanisms"`);
    await queryRunner.query(`DROP TABLE "procurement_requisition_items"`);
    await queryRunner.query(
      `DROP TABLE "procurement_requisition_item_references"`,
    );
    await queryRunner.query(
      `DROP TABLE "procurement_requisition_officer_assignments"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_requisition_timelines"`);
    await queryRunner.query(`DROP TABLE "procurement_requisition_documents"`);
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "FK_2fef51181a2a512503ed7b57ff8" FOREIGN KEY ("postBudgetPlanId") REFERENCES "post_budget_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD CONSTRAINT "FK_c0184be189b8463828d5833a795" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

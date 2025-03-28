import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1718356877618 implements MigrationInterface {
  name = 'Init1718356877618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "submitted_plans" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plan" jsonb NOT NULL, "objectType" character varying NOT NULL, "objectId" uuid NOT NULL, "version" integer NOT NULL, CONSTRAINT "PK_6c0f05f015246eb04fe0d93d90b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fundingSource" character varying NOT NULL, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "donor" jsonb NOT NULL, "targetGroup" jsonb NOT NULL, "isOnline" boolean NOT NULL DEFAULT true, "contract" json NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "REL_80a238a65e77152cca669d86c4" UNIQUE ("procurementRequisitionId"), CONSTRAINT "PK_8685ab6b89ae9fe4d5319ab84ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "itemCode" character varying, "description" character varying NOT NULL, "unitPrice" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "quantity" numeric NOT NULL, "measurement" character varying NOT NULL, "uomName" character varying NOT NULL, "classification" character varying NOT NULL, CONSTRAINT "CHK_55e917dd00e9409c1c2345c977" CHECK ("quantity" >= 0 AND "unitPrice" >= 0), CONSTRAINT "PK_3143ba6632f2ac09e6ddc49affb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_timelines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "timeline" character varying, "order" integer NOT NULL, "dueDate" TIMESTAMP NOT NULL, "period" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', CONSTRAINT "UQ_8c629da7fe47a59122b8610ba2e" UNIQUE ("order", "preBudgetPlanActivityId"), CONSTRAINT "CHK_0106570cfd16ef2a0a26424475" CHECK ("order" >= 0 AND "period" >= 0), CONSTRAINT "PK_8bd9d206621978b131bb6b4bb1c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_requisitioners" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "name" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_6a6614839fcdbeaa72359ea979e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "fundingSource" character varying NOT NULL, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "donor" jsonb NOT NULL, "targetGroup" jsonb NOT NULL, "isOnline" boolean NOT NULL, "contract" json NOT NULL, CONSTRAINT "REL_ae8b9786dfaa7518966ba6dfd6" UNIQUE ("preBudgetPlanActivityId"), CONSTRAINT "PK_49d95b6af49f4b55041b0c5f35a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_activity_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "title" character varying NOT NULL, "fileInfo" jsonb NOT NULL, CONSTRAINT "PK_b38f79852be3640ff43a531ade7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plans" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appId" uuid NOT NULL, "preBudgetPlanId" uuid NOT NULL, "estimatedAmount" json NOT NULL, "status" character varying NOT NULL, CONSTRAINT "REL_7cc9c3e08beb3e05f5a797f74a" UNIQUE ("appId"), CONSTRAINT "REL_baa782e204cae5e8f24d9d504b" UNIQUE ("preBudgetPlanId"), CONSTRAINT "PK_ba14ac2d59cbadf2c44ba8b0fe0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "activity_budget_lines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "BudgetId" character varying NOT NULL, "amount" character varying NOT NULL, "budgetCode" character varying NOT NULL, "budgetId" uuid, CONSTRAINT "PK_d39f662420c8d751d165609ca0a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_budget_line" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityBudgetLineId" uuid NOT NULL, "postBudgetPlanItemsId" uuid NOT NULL, CONSTRAINT "PK_e12dff7ebe51e4ef51c021d5fb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "budgetId" uuid, "itemCode" character varying, "description" character varying NOT NULL, "unitPrice" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "quantity" numeric NOT NULL, "measurement" character varying NOT NULL, "uomName" character varying NOT NULL, "classification" character varying NOT NULL, CONSTRAINT "CHK_1031eabc8f736b621a8fc0c50f" CHECK ("unitPrice" >= 0 AND "quantity" >= 0), CONSTRAINT "PK_98ba5210f2dd5e97b365b409850" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_timelines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "timeline" character varying, "order" integer NOT NULL, "dueDate" TIMESTAMP NOT NULL, "period" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', CONSTRAINT "UQ_4f46ad3893047039813d7bb4abb" UNIQUE ("order", "postBudgetPlanActivityId"), CONSTRAINT "CHK_0e8f039cce33d2fb1bd436a67d" CHECK ("order" >= 0 AND "period" >= 0), CONSTRAINT "PK_3dda54c6fb44fcbe3cd067df039" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_disbursements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "budgetYear" character varying NOT NULL, "quarter1" character varying NOT NULL, "quarter2" character varying NOT NULL, "quarter3" character varying NOT NULL, "quarter4" character varying NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, CONSTRAINT "CHK_a4b4b08a756e882fffd9c9738d" CHECK ("amount" >= 0), CONSTRAINT "PK_41dd25703834ba99114d281adc2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_activity_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "title" character varying NOT NULL, "fileInfo" jsonb NOT NULL, CONSTRAINT "PK_7b3036a7df8c34e65bbbe477aff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_requisitioners" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "name" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_16a6b7d05e5de2213706e7fc7d2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "fundingSource" character varying NOT NULL, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "donor" jsonb NOT NULL, "targetGroup" jsonb NOT NULL, "isOnline" boolean NOT NULL, "contract" json NOT NULL, CONSTRAINT "REL_a4bec97b4fbe8f711d190e9ad6" UNIQUE ("postBudgetPlanActivityId"), CONSTRAINT "PK_82f96fef42f318627f0e9b5d177" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_activities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanId" uuid NOT NULL, "budgetId" uuid, "name" character varying NOT NULL, "procurementReference" character varying NOT NULL, "description" character varying NOT NULL, "estimatedAmount" numeric(14,2) NOT NULL DEFAULT '0', "calculatedAmount" numeric(14,2) NOT NULL DEFAULT '0', "status" character varying NOT NULL DEFAULT 'Draft', "currency" character varying NOT NULL, "isMultiYear" boolean NOT NULL, "remark" character varying, "classification" jsonb, "userReference" character varying, CONSTRAINT "UQ_970044ea41c1a6649f15c2ee025" UNIQUE ("userReference"), CONSTRAINT "UQ_ad1143400a9a09b9b8d52985f1f" UNIQUE ("procurementReference"), CONSTRAINT "CHK_9ddbcf4ae28780bd9c8cb4ae10" CHECK ("estimatedAmount" >= 0 AND "calculatedAmount" >= 0), CONSTRAINT "PK_79a334af6584c8ba10c27e751ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reasons" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid, "postBudgetPlanActivityId" uuid, "procurementRequisitionId" uuid, "objectId" uuid, "type" character varying NOT NULL, "reason" text NOT NULL, "remark" text NOT NULL, CONSTRAINT "PK_b8104b87e316aacce0c709000a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_activities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanId" uuid NOT NULL, "name" character varying NOT NULL, "procurementReference" character varying NOT NULL, "description" character varying NOT NULL, "estimatedAmount" numeric(14,2) NOT NULL DEFAULT '0', "calculatedAmount" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'Draft', "isMultiYear" boolean NOT NULL, "remark" character varying, "classification" jsonb, "userReference" character varying, CONSTRAINT "UQ_2cbb67b8374b66e90a6b227f0fb" UNIQUE ("userReference"), CONSTRAINT "UQ_61fabba5759b9ea169407a38a2d" UNIQUE ("procurementReference"), CONSTRAINT "CHK_636d1d5db6446b40b50eff36a7" CHECK ("estimatedAmount" >= 0 AND "calculatedAmount" >= 0), CONSTRAINT "PK_7a336b2f4838086a7c819a19abc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plans" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appId" uuid NOT NULL, "estimatedAmount" json NOT NULL, "status" character varying NOT NULL DEFAULT 'Draft', CONSTRAINT "REL_f7e5b79677a71719df88a30f39" UNIQUE ("appId"), CONSTRAINT "PK_c0b820693ceda5635fae94b9ef8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "budget_years" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "CHK_f1c91a09b5ae530e5d8657c05a" CHECK ("startDate" < "endDate"), CONSTRAINT "PK_84f3140815adce0064be083ce8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "apps" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "planName" character varying, "budgetYear" character varying NOT NULL, "budgetYearId" uuid NOT NULL, "description" character varying, CONSTRAINT "PK_c5121fda0f8268f1f7f84134e19" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "budget" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "budgetYearId" uuid NOT NULL, "appId" uuid NOT NULL, "type" character varying, "budgetCode" character varying NOT NULL, "description" character varying NOT NULL, "currency" character varying NOT NULL, "fundingSource" character varying NOT NULL, "allocatedBudget" numeric(14,2) NOT NULL, "revisedBudget" numeric(14,2) NOT NULL, "obligatedBudget" numeric(14,2) NOT NULL DEFAULT '0', "availableBudget" numeric(14,2) NOT NULL DEFAULT '0', CONSTRAINT "UQ_a500a135b40a8bfa90c0f3d0200" UNIQUE ("budgetCode"), CONSTRAINT "CHK_de228b5963ead33e4a78a504c5" CHECK ("availableBudget" >= 0 AND "obligatedBudget" >= 0 AND "revisedBudget" >= 0 AND "allocatedBudget" >= 0 AND "availableBudget" <= "revisedBudget" AND "obligatedBudget" <= "revisedBudget" ), CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemCode" character varying NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "description" character varying, "unitPrice" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "quantity" numeric NOT NULL, "measurement" character varying NOT NULL, "uom" character varying, "bom" character varying, "budgetId" uuid, "classification" character varying, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_907ed0d7efa729947ccc7930dfc" UNIQUE ("procurementRequisitionId", "itemCode", "currency", "measurement", "deletedAt"), CONSTRAINT "UQ_0f4c3d64833f192fd6005e3d787" UNIQUE ("organizationId", "itemCode", "deletedAt"), CONSTRAINT "CHK_c79448c957e5208d16d9fba6cb" CHECK ("unitPrice" >= 0 AND "quantity" >= 0), CONSTRAINT "PK_f229fd2ab23693583f54e88df26" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_technical_teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid NOT NULL, "procurementRequisitionId" uuid NOT NULL, "isTeamLeader" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_7ebd3193d73796eec34459c0be1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_timelines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timeline" character varying, "order" integer NOT NULL, "dueDate" TIMESTAMP NOT NULL, "appDueDate" TIMESTAMP, "period" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_ecf1a3af519afd5f18124d4f2b6" UNIQUE ("order", "procurementRequisitionId", "deletedAt"), CONSTRAINT "CHK_786f19b5666b9fde9cb85b4120" CHECK ("order" >= 0 AND "period" >= 0), CONSTRAINT "PK_d3f71f6b05ee1e054b474385134" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."procurement_requisitions_procurementapplication_enum" AS ENUM('tendering', 'purchasing', 'auctioning')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."procurement_requisitions_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'ADJUSTED', 'REJECTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisitions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "procurementReference" character varying NOT NULL, "userReference" character varying, "isUsed" boolean NOT NULL DEFAULT false, "totalEstimatedAmount" numeric(14,2) NOT NULL DEFAULT '0', "calculatedAmount" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL DEFAULT 'USD', "procurementApplication" "public"."procurement_requisitions_procurementapplication_enum" NOT NULL DEFAULT 'tendering', "budgetId" uuid, "budgetYearId" uuid, "postBudgetPlanId" uuid, "isPlanned" boolean NOT NULL DEFAULT false, "isMultiYear" boolean NOT NULL DEFAULT false, "isFundAvailable" boolean NOT NULL DEFAULT false, "postBudgetPlanActivityId" character varying, "remark" character varying, "status" "public"."procurement_requisitions_status_enum" NOT NULL DEFAULT 'DRAFT', "postBudgetActivityId" uuid, CONSTRAINT "UQ_f42e85c831489da44917a4b35c7" UNIQUE ("procurementReference"), CONSTRAINT "UQ_49fb9d574dbc45dd6cd704f0322" UNIQUE ("procurementReference", "deletedAt"), CONSTRAINT "PK_6d0ad196f5ce5943ac50e920255" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "fileInfo" jsonb NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "PK_9c166d52ffb1af4db4ceb248318" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hashes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hash" character varying NOT NULL, "originalData" jsonb NOT NULL, "objectId" character varying NOT NULL, "objectType" character varying NOT NULL, "createdBy" character varying NOT NULL, CONSTRAINT "PK_5448e0a870142d3259f11b9fac0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "fileInfo" jsonb NOT NULL, "itemId" character varying NOT NULL, "type" character varying NOT NULL, "version" integer NOT NULL, "key" character varying NOT NULL, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "FK_80a238a65e77152cca669d86c44" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD CONSTRAINT "FK_ced404d8f6a5ee69c4cbc7fb2aa" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD CONSTRAINT "FK_f819bc1f8aed832e4cf8d631498" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_requisitioners" ADD CONSTRAINT "FK_07ab4dc26b0512671bb0aee78d0" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" ADD CONSTRAINT "FK_ae8b9786dfaa7518966ba6dfd66" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ADD CONSTRAINT "FK_8c045af86ce0a222b5877c3b319" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD CONSTRAINT "FK_7cc9c3e08beb3e05f5a797f74a2" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD CONSTRAINT "FK_baa782e204cae5e8f24d9d504b7" FOREIGN KEY ("preBudgetPlanId") REFERENCES "pre_budget_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ADD CONSTRAINT "FK_9bb6c761b22d47d1fb0d3226ff0" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ADD CONSTRAINT "FK_406f9233a16075c5d36c84fd323" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD CONSTRAINT "FK_3be6aa33082620f9ffae4fd6098" FOREIGN KEY ("activityBudgetLineId") REFERENCES "activity_budget_lines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD CONSTRAINT "FK_efd8dc3911f6082f0ec9d04f7c9" FOREIGN KEY ("postBudgetPlanItemsId") REFERENCES "post_budget_plan_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD CONSTRAINT "FK_eff837980d4ca10a4823ad88c8f" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD CONSTRAINT "FK_124490bacba564dae74fb2683e5" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD CONSTRAINT "FK_a6677a7b07c81a0fc2f29cac6ef" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "FK_c4921e1c3481ee3b77dda14021e" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ADD CONSTRAINT "FK_16e36427a848b0a22a81e861e6b" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_requisitioners" ADD CONSTRAINT "FK_09eccd9e50b129a423bd79643e4" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" ADD CONSTRAINT "FK_a4bec97b4fbe8f711d190e9ad61" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "FK_6bf41fbc3395df07f01a1ad53af" FOREIGN KEY ("postBudgetPlanId") REFERENCES "post_budget_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "FK_adb6cdc555dddcf65522c9d0860" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD CONSTRAINT "FK_5c652b7f0f93d02a746a6b01eff" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD CONSTRAINT "FK_737c0d61558801920a8bf787c44" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD CONSTRAINT "FK_82dab153bd1fa6b09bcc031592e" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD CONSTRAINT "FK_5c919265e7d992ac5df09a37de1" FOREIGN KEY ("preBudgetPlanId") REFERENCES "pre_budget_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD CONSTRAINT "FK_f7e5b79677a71719df88a30f39d" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "FK_6ddfa3525052351795ce2013d87" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "FK_dd605e373c37b79e86f0ed25ef8" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "FK_1bf7943ead57197f827572a77d0" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "FK_6f8554407c58ad45931f91fcdc1" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" ADD CONSTRAINT "FK_9e4487fbd9ed899406395491d26" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD CONSTRAINT "FK_2a6c4b46c333e2320278bad7340" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "FK_2fef51181a2a512503ed7b57ff8" FOREIGN KEY ("postBudgetPlanId") REFERENCES "post_budget_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "FK_5fe6db95830f297255f4ae718aa" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "FK_d63d359feede2cc4b9023d7cb62" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "FK_b673f0a6b1d41634892347907ca" FOREIGN KEY ("postBudgetActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" ADD CONSTRAINT "FK_927692bdb26c6df5886dd3b25f2" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" DROP CONSTRAINT "FK_927692bdb26c6df5886dd3b25f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "FK_b673f0a6b1d41634892347907ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "FK_d63d359feede2cc4b9023d7cb62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "FK_5fe6db95830f297255f4ae718aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "FK_2fef51181a2a512503ed7b57ff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP CONSTRAINT "FK_2a6c4b46c333e2320278bad7340"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" DROP CONSTRAINT "FK_9e4487fbd9ed899406395491d26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "FK_6f8554407c58ad45931f91fcdc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "FK_1bf7943ead57197f827572a77d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "FK_dd605e373c37b79e86f0ed25ef8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "FK_6ddfa3525052351795ce2013d87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" DROP CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP CONSTRAINT "FK_f7e5b79677a71719df88a30f39d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP CONSTRAINT "FK_5c919265e7d992ac5df09a37de1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP CONSTRAINT "FK_82dab153bd1fa6b09bcc031592e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP CONSTRAINT "FK_737c0d61558801920a8bf787c44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP CONSTRAINT "FK_5c652b7f0f93d02a746a6b01eff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "FK_adb6cdc555dddcf65522c9d0860"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "FK_6bf41fbc3395df07f01a1ad53af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" DROP CONSTRAINT "FK_a4bec97b4fbe8f711d190e9ad61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_requisitioners" DROP CONSTRAINT "FK_09eccd9e50b129a423bd79643e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP CONSTRAINT "FK_16e36427a848b0a22a81e861e6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "FK_c4921e1c3481ee3b77dda14021e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP CONSTRAINT "FK_a6677a7b07c81a0fc2f29cac6ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP CONSTRAINT "FK_124490bacba564dae74fb2683e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP CONSTRAINT "FK_eff837980d4ca10a4823ad88c8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP CONSTRAINT "FK_efd8dc3911f6082f0ec9d04f7c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP CONSTRAINT "FK_3be6aa33082620f9ffae4fd6098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" DROP CONSTRAINT "FK_406f9233a16075c5d36c84fd323"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" DROP CONSTRAINT "FK_9bb6c761b22d47d1fb0d3226ff0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP CONSTRAINT "FK_baa782e204cae5e8f24d9d504b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP CONSTRAINT "FK_7cc9c3e08beb3e05f5a797f74a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" DROP CONSTRAINT "FK_8c045af86ce0a222b5877c3b319"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" DROP CONSTRAINT "FK_ae8b9786dfaa7518966ba6dfd66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_requisitioners" DROP CONSTRAINT "FK_07ab4dc26b0512671bb0aee78d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP CONSTRAINT "FK_f819bc1f8aed832e4cf8d631498"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP CONSTRAINT "FK_ced404d8f6a5ee69c4cbc7fb2aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "FK_80a238a65e77152cca669d86c44"`,
    );
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "hashes"`);
    await queryRunner.query(`DROP TABLE "procurement_requisition_documents"`);
    await queryRunner.query(`DROP TABLE "procurement_requisitions"`);
    await queryRunner.query(
      `DROP TYPE "public"."procurement_requisitions_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."procurement_requisitions_procurementapplication_enum"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_requisition_timelines"`);
    await queryRunner.query(
      `DROP TABLE "procurement_requisition_technical_teams"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_requisition_items"`);
    await queryRunner.query(`DROP TABLE "budget"`);
    await queryRunner.query(`DROP TABLE "apps"`);
    await queryRunner.query(`DROP TABLE "budget_years"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plans"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_activities"`);
    await queryRunner.query(`DROP TABLE "reasons"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_activities"`);
    await queryRunner.query(`DROP TABLE "post_procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_requisitioners"`);
    await queryRunner.query(`DROP TABLE "post_budget_activity_documents"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_disbursements"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_timelines"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_items"`);
    await queryRunner.query(`DROP TABLE "item_budget_line"`);
    await queryRunner.query(`DROP TABLE "activity_budget_lines"`);
    await queryRunner.query(`DROP TABLE "post_budget_plans"`);
    await queryRunner.query(`DROP TABLE "pre_budget_activity_documents"`);
    await queryRunner.query(`DROP TABLE "pre_procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_requisitioners"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_timelines"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_items"`);
    await queryRunner.query(`DROP TABLE "procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "submitted_plans"`);
  }
}

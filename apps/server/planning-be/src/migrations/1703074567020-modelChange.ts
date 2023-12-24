import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModelChange1703074567020 implements MigrationInterface {
  name = 'ModelChange1703074567020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_requisitioners" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "name" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_6a6614839fcdbeaa72359ea979e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "fundingSource" character varying NOT NULL, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "donor" jsonb NOT NULL, "targetGroup" jsonb NOT NULL, "isOnline" boolean NOT NULL, "contract" json NOT NULL, CONSTRAINT "PK_49d95b6af49f4b55041b0c5f35a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_activity_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "fileName" character varying NOT NULL, "fileType" character varying NOT NULL, "bucketName" character varying NOT NULL, "originalName" character varying NOT NULL, "path" character varying NOT NULL, CONSTRAINT "PK_b38f79852be3640ff43a531ade7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "budget_years" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_84f3140815adce0064be083ce8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "activity_budget_lines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "BudgetId" character varying NOT NULL, "amount" character varying NOT NULL, "budgetId" uuid, CONSTRAINT "PK_d39f662420c8d751d165609ca0a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_budget_line" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityCoAtagId" character varying NOT NULL, "postBudgetPlanItemsId" uuid NOT NULL, "activityBudgetLineId" uuid, CONSTRAINT "PK_e12dff7ebe51e4ef51c021d5fb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_activity_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "fileName" character varying NOT NULL, "fileType" character varying NOT NULL, "bucketName" character varying NOT NULL, "originalName" character varying NOT NULL, "path" character varying NOT NULL, CONSTRAINT "PK_7b3036a7df8c34e65bbbe477aff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_requisitioners" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "name" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_16a6b7d05e5de2213706e7fc7d2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "fundingSource" character varying NOT NULL, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "donor" jsonb NOT NULL, "targetGroup" jsonb NOT NULL, "isOnline" boolean NOT NULL, "contract" json NOT NULL, CONSTRAINT "PK_82f96fef42f318627f0e9b5d177" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "itemCodeReferenceType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "metaData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "specification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "activityName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "fromDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "toDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "operationMethod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "totalEstimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "fundingSource"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "procurementMethod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "procurementType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "procurementStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "donor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "multiYearBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "procurementProcess"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "preference"`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "coa"`);
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "plannedValue"`);
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "activityName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "fromDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "toDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "operationMethod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "quarterName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "metaData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "unitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP COLUMN "totalEstimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP COLUMN "totalEstimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "classification" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "timeline" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "dueDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "estimatedAmount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "classification" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "budgetYearId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "budgetCode" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "revisedBudget" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "obligatedBudget" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "availableBudget" bigint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" ADD "budget_year" uuid`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "UQ_9523022156de2ef2547161f4f53" UNIQUE ("budget_year")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "timeline" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "dueDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "quarter" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "order" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "currency" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD "estimatedAmount" json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD "estimatedAmount" json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "apps" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "apps" ADD "organizationId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "type" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "fundingSource"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "fundingSource" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "preference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "preference" jsonb NOT NULL DEFAULT '["Others"]'`,
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
      `ALTER TABLE "budget" ADD CONSTRAINT "FK_9523022156de2ef2547161f4f53" FOREIGN KEY ("budget_year") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "post_budget_activity_documents" ADD CONSTRAINT "FK_16e36427a848b0a22a81e861e6b" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_requisitioners" ADD CONSTRAINT "FK_09eccd9e50b129a423bd79643e4" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "post_budget_plan_requisitioners" DROP CONSTRAINT "FK_09eccd9e50b129a423bd79643e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP CONSTRAINT "FK_16e36427a848b0a22a81e861e6b"`,
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
      `ALTER TABLE "budget" DROP CONSTRAINT "FK_9523022156de2ef2547161f4f53"`,
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
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "preference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "preference" text NOT NULL DEFAULT '["Others"]'`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "fundingSource"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "fundingSource" text NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ALTER COLUMN "type" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "apps" DROP COLUMN "organizationId"`);
    await queryRunner.query(`ALTER TABLE "apps" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "apps" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "apps" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "apps" DROP COLUMN "tenantId"`);
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "order"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "quarter"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "dueDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP COLUMN "timeline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "UQ_9523022156de2ef2547161f4f53"`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "budget_year"`);
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "availableBudget"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP COLUMN "obligatedBudget"`,
    );
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "revisedBudget"`);
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "budgetCode"`);
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "budgetYearId"`);
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "classification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "dueDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "timeline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "classification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD "currency" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD "totalEstimatedAmount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD "currency" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD "totalEstimatedAmount" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "unitPrice" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "metaData" json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "quarterName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "operationMethod" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "toDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "fromDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD "activityName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "balance" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "plannedValue" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "coa" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "preference" text NOT NULL DEFAULT '["Others"]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "procurementProcess" character varying NOT NULL DEFAULT 'Online'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "multiYearBudget" json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "donor" json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "procurementStatus" character varying NOT NULL DEFAULT 'Draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "procurementType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "procurementMethod" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "fundingSource" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "totalEstimatedAmount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "operationMethod" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "toDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "fromDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD "activityName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "specification" json`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "metaData" json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "itemCodeReferenceType" character varying NOT NULL DEFAULT 'UNSPSC'`,
    );
    await queryRunner.query(`DROP TABLE "post_procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_requisitioners"`);
    await queryRunner.query(`DROP TABLE "post_budget_activity_documents"`);
    await queryRunner.query(`DROP TABLE "item_budget_line"`);
    await queryRunner.query(`DROP TABLE "activity_budget_lines"`);
    await queryRunner.query(`DROP TABLE "budget_years"`);
    await queryRunner.query(`DROP TABLE "pre_budget_activity_documents"`);
    await queryRunner.query(`DROP TABLE "pre_procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_requisitioners"`);
  }
}

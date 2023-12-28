import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrgAuditOnEntities1703741762260 implements MigrationInterface {
  name = 'AddOrgAuditOnEntities1703741762260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "itemCode" character varying NOT NULL, "description" character varying NOT NULL, "unitPrice" integer NOT NULL, "currency" character varying NOT NULL, "quantity" integer NOT NULL, "measurement" character varying NOT NULL, "uom" character varying NOT NULL, "uomName" character varying NOT NULL, "classification" character varying NOT NULL, CONSTRAINT "PK_3143ba6632f2ac09e6ddc49affb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_timelines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "timeline" character varying, "order" integer NOT NULL, "dueDate" TIMESTAMP NOT NULL, "period" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', CONSTRAINT "PK_8bd9d206621978b131bb6b4bb1c" PRIMARY KEY ("id"))`,
    );
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
      `CREATE TABLE "pre_budget_plan_activities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanId" uuid NOT NULL, "name" character varying NOT NULL, "procurementReference" character varying NOT NULL, "description" character varying NOT NULL, "estimatedAmount" integer NOT NULL DEFAULT '0', "calculatedAmount" integer NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'Draft', "isMultiYear" boolean NOT NULL, "remark" character varying, "classification" jsonb, CONSTRAINT "PK_7a336b2f4838086a7c819a19abc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_disbursements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "budgetYearName" character varying NOT NULL, "quarter" character varying NOT NULL, "order" integer NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, "budget_year" uuid, CONSTRAINT "REL_09180d611e035643f5788d385f" UNIQUE ("budget_year"), CONSTRAINT "PK_41dd25703834ba99114d281adc2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "budget_years" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_84f3140815adce0064be083ce8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "budget" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "budgetYearId" uuid NOT NULL, "appId" uuid NOT NULL, "type" character varying, "budgetCode" character varying NOT NULL, "description" character varying NOT NULL, "currency" character varying NOT NULL, "fundingSource" character varying NOT NULL, "allocatedBudget" bigint NOT NULL, "revisedBudget" bigint NOT NULL, "obligatedBudget" bigint NOT NULL, "availableBudget" bigint NOT NULL, CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "activity_budget_lines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "BudgetId" character varying NOT NULL, "amount" character varying NOT NULL, "budgetId" uuid, CONSTRAINT "PK_d39f662420c8d751d165609ca0a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_budget_line" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityCoAtagId" character varying NOT NULL, "postBudgetPlanItemsId" uuid NOT NULL, "activityBudgetLineId" uuid, CONSTRAINT "PK_e12dff7ebe51e4ef51c021d5fb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "budgetId" uuid, "itemCode" character varying NOT NULL, "description" character varying NOT NULL, "specification" json, "unitPrice" integer NOT NULL, "currency" character varying NOT NULL, "quantity" integer NOT NULL, "measurement" character varying NOT NULL, "uom" character varying NOT NULL, CONSTRAINT "PK_98ba5210f2dd5e97b365b409850" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_timelines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "timeline" character varying, "order" integer NOT NULL, "dueDate" TIMESTAMP NOT NULL, "period" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', CONSTRAINT "PK_3dda54c6fb44fcbe3cd067df039" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "post_budget_plan_activities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanId" uuid NOT NULL, "name" character varying NOT NULL, "procurementReference" character varying NOT NULL, "description" character varying NOT NULL, "estimatedAmount" integer NOT NULL, "calculatedAmount" integer NOT NULL DEFAULT '0', "status" character varying NOT NULL DEFAULT 'Draft', "currency" character varying NOT NULL, "isMultiYear" boolean NOT NULL, "remark" character varying, "classification" jsonb, CONSTRAINT "PK_79a334af6584c8ba10c27e751ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plans" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appId" uuid NOT NULL, "preBudgetPlanId" uuid NOT NULL, "estimatedAmount" json NOT NULL, "status" character varying NOT NULL, CONSTRAINT "REL_7cc9c3e08beb3e05f5a797f74a" UNIQUE ("appId"), CONSTRAINT "REL_baa782e204cae5e8f24d9d504b" UNIQUE ("preBudgetPlanId"), CONSTRAINT "PK_ba14ac2d59cbadf2c44ba8b0fe0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plans" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appId" uuid NOT NULL, "estimatedAmount" json NOT NULL, "status" character varying NOT NULL DEFAULT 'Draft', CONSTRAINT "REL_f7e5b79677a71719df88a30f39" UNIQUE ("appId"), CONSTRAINT "PK_c0b820693ceda5635fae94b9ef8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "apps" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "planName" character varying, "budgetYear" character varying NOT NULL, "budgetYearId" uuid NOT NULL, "description" character varying, CONSTRAINT "REL_d855a79a1fd5aff929051e04b6" UNIQUE ("budgetYearId"), CONSTRAINT "PK_c5121fda0f8268f1f7f84134e19" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "pre_budget_plan_activities" ADD CONSTRAINT "FK_5c919265e7d992ac5df09a37de1" FOREIGN KEY ("preBudgetPlanId") REFERENCES "pre_budget_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "FK_c4921e1c3481ee3b77dda14021e" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "FK_09180d611e035643f5788d385ff" FOREIGN KEY ("budget_year") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "FK_6ddfa3525052351795ce2013d87" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "FK_dd605e373c37b79e86f0ed25ef8" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "post_budget_plans" ADD CONSTRAINT "FK_7cc9c3e08beb3e05f5a797f74a2" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD CONSTRAINT "FK_baa782e204cae5e8f24d9d504b7" FOREIGN KEY ("preBudgetPlanId") REFERENCES "pre_budget_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD CONSTRAINT "FK_f7e5b79677a71719df88a30f39d" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a" FOREIGN KEY ("budgetYearId") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apps" DROP CONSTRAINT "FK_d855a79a1fd5aff929051e04b6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP CONSTRAINT "FK_f7e5b79677a71719df88a30f39d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP CONSTRAINT "FK_baa782e204cae5e8f24d9d504b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP CONSTRAINT "FK_7cc9c3e08beb3e05f5a797f74a2"`,
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
      `ALTER TABLE "budget" DROP CONSTRAINT "FK_dd605e373c37b79e86f0ed25ef8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "FK_6ddfa3525052351795ce2013d87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "FK_09180d611e035643f5788d385ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "FK_c4921e1c3481ee3b77dda14021e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP CONSTRAINT "FK_5c919265e7d992ac5df09a37de1"`,
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
    await queryRunner.query(`DROP TABLE "apps"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plans"`);
    await queryRunner.query(`DROP TABLE "post_budget_plans"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_activities"`);
    await queryRunner.query(`DROP TABLE "post_procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_requisitioners"`);
    await queryRunner.query(`DROP TABLE "post_budget_activity_documents"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_timelines"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_items"`);
    await queryRunner.query(`DROP TABLE "item_budget_line"`);
    await queryRunner.query(`DROP TABLE "activity_budget_lines"`);
    await queryRunner.query(`DROP TABLE "budget"`);
    await queryRunner.query(`DROP TABLE "budget_years"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_disbursements"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_activities"`);
    await queryRunner.query(`DROP TABLE "pre_budget_activity_documents"`);
    await queryRunner.query(`DROP TABLE "pre_procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_requisitioners"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_timelines"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_items"`);
  }
}

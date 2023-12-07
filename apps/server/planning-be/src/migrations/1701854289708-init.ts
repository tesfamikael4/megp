import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1701854289708 implements MigrationInterface {
  name = 'Init1701854289708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "itemCodeReferenceType" character varying NOT NULL DEFAULT 'UNSPSC', "itemCode" character varying NOT NULL, "metaData" json NOT NULL, "description" character varying NOT NULL, "specification" json, "unitPrice" integer NOT NULL, "currency" character varying NOT NULL, "quantity" integer NOT NULL, "measurement" character varying NOT NULL, "uom" character varying NOT NULL, "uomName" character varying NOT NULL, CONSTRAINT "PK_3143ba6632f2ac09e6ddc49affb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_timelines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "activityName" character varying NOT NULL, "fromDate" TIMESTAMP NOT NULL, "toDate" TIMESTAMP NOT NULL, "operationMethod" character varying NOT NULL, "period" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_8bd9d206621978b131bb6b4bb1c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budge_plan_disbursements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "quarterName" character varying NOT NULL, "description" character varying NOT NULL, "metaData" json NOT NULL, "amount" integer NOT NULL, "unitPrice" integer NOT NULL, CONSTRAINT "PK_a57ae736710677f7992b1090050" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_framework_contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanActivityId" uuid NOT NULL, "contractName" character varying NOT NULL, "contractNumber" character varying NOT NULL, "agreement" character varying NOT NULL, CONSTRAINT "PK_f103ebff24b6090843476ec1b0a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plan_activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preBudgetPlanId" uuid NOT NULL, "name" character varying NOT NULL, "procurementReference" character varying NOT NULL, "description" character varying NOT NULL, "totalEstimatedAmount" integer NOT NULL DEFAULT '0', "calculatedAmount" integer NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "fundingSource" character varying NOT NULL, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "procurementStatus" character varying NOT NULL DEFAULT 'Draft', "donor" json NOT NULL, "isMultiYear" boolean NOT NULL, "multiYearBudget" json NOT NULL, "preference" character varying NOT NULL DEFAULT 'Others', "procurementProcess" character varying NOT NULL DEFAULT 'Online', "remark" character varying, CONSTRAINT "PK_7a336b2f4838086a7c819a19abc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pre_budget_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appId" uuid NOT NULL, "totalEstimatedAmount" integer NOT NULL, "currency" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'Draft', CONSTRAINT "REL_f7e5b79677a71719df88a30f39" UNIQUE ("appId"), CONSTRAINT "PK_c0b820693ceda5635fae94b9ef8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "budget" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coa" character varying NOT NULL, "allocatedBudget" character varying NOT NULL, "plannedValue" character varying NOT NULL, "balance" character varying NOT NULL, "currency" character varying NOT NULL, "type" character varying NOT NULL, "appId" uuid NOT NULL, CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "apps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "planName" character varying, "budgetYear" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_c5121fda0f8268f1f7f84134e19" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appId" uuid NOT NULL, "preBudgetPlanId" uuid NOT NULL, "totalEstimatedAmount" integer NOT NULL, "currency" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "REL_7cc9c3e08beb3e05f5a797f74a" UNIQUE ("appId"), CONSTRAINT "REL_baa782e204cae5e8f24d9d504b" UNIQUE ("preBudgetPlanId"), CONSTRAINT "PK_ba14ac2d59cbadf2c44ba8b0fe0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_coa_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityCoAtagId" uuid NOT NULL, "postBudgetPlanItemsId" uuid NOT NULL, CONSTRAINT "PK_fdc8ee0501a507667922788fc7e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "itemCodeReferenceType" character varying NOT NULL, "itemCode" character varying NOT NULL, "metaData" json NOT NULL, "description" character varying NOT NULL, "specification" json, "unitPrice" integer NOT NULL, "currency" character varying NOT NULL, "quantity" integer NOT NULL, "measurement" character varying NOT NULL, "uom" character varying NOT NULL, "uomName" character varying NOT NULL, CONSTRAINT "PK_98ba5210f2dd5e97b365b409850" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_timelines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "activityName" character varying NOT NULL, "fromDate" TIMESTAMP NOT NULL, "toDate" TIMESTAMP NOT NULL, "operationMethod" character varying NOT NULL, "period" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_3dda54c6fb44fcbe3cd067df039" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_framework_contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "contractName" character varying NOT NULL, "contractNumber" character varying NOT NULL, "agreement" character varying NOT NULL, CONSTRAINT "PK_f42e18497d6ed19f34637d6f737" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_disbursements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "quarterName" character varying NOT NULL, "description" character varying NOT NULL, "metaData" json NOT NULL, "amount" integer NOT NULL, "unitPrice" integer NOT NULL, CONSTRAINT "PK_41dd25703834ba99114d281adc2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanId" uuid NOT NULL, "name" character varying NOT NULL, "procurementReference" character varying NOT NULL, "description" character varying NOT NULL, "totalEstimatedAmount" integer NOT NULL, "calculatedAmount" integer NOT NULL, "currency" character varying NOT NULL, "fundingSource" character varying NOT NULL, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "procurementStatus" character varying NOT NULL DEFAULT 'Draft', "donor" json NOT NULL, "isMultiYear" boolean NOT NULL, "multiYearBudget" json NOT NULL, "preference" character varying NOT NULL DEFAULT 'Others', "procurementProcess" character varying NOT NULL DEFAULT 'Online', "remark" character varying, CONSTRAINT "PK_79a334af6584c8ba10c27e751ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "activity_coa_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postBudgetPlanActivityId" uuid NOT NULL, "coAid" character varying NOT NULL, "name" character varying NOT NULL, "coAcode" character varying NOT NULL, CONSTRAINT "PK_9f46b482c8e3a5ab60f42674698" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD CONSTRAINT "FK_ced404d8f6a5ee69c4cbc7fb2aa" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD CONSTRAINT "FK_f819bc1f8aed832e4cf8d631498" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budge_plan_disbursements" ADD CONSTRAINT "FK_551437d4ddb1b61bebb819fa6ed" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_framework_contracts" ADD CONSTRAINT "FK_3dd37af8fe745749ec984bc3366" FOREIGN KEY ("preBudgetPlanActivityId") REFERENCES "pre_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD CONSTRAINT "FK_5c919265e7d992ac5df09a37de1" FOREIGN KEY ("preBudgetPlanId") REFERENCES "pre_budget_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD CONSTRAINT "FK_f7e5b79677a71719df88a30f39d" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "FK_dd605e373c37b79e86f0ed25ef8" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD CONSTRAINT "FK_7cc9c3e08beb3e05f5a797f74a2" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD CONSTRAINT "FK_baa782e204cae5e8f24d9d504b7" FOREIGN KEY ("preBudgetPlanId") REFERENCES "pre_budget_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_coa_tags" ADD CONSTRAINT "FK_f0bfe484fc00491880170bd414f" FOREIGN KEY ("activityCoAtagId") REFERENCES "activity_coa_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_coa_tags" ADD CONSTRAINT "FK_dc219e070ba9a42c331c6786551" FOREIGN KEY ("postBudgetPlanItemsId") REFERENCES "post_budget_plan_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD CONSTRAINT "FK_eff837980d4ca10a4823ad88c8f" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD CONSTRAINT "FK_a6677a7b07c81a0fc2f29cac6ef" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_framework_contracts" ADD CONSTRAINT "FK_accb62b2238f4e2890d65248534" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "FK_c4921e1c3481ee3b77dda14021e" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "FK_6bf41fbc3395df07f01a1ad53af" FOREIGN KEY ("postBudgetPlanId") REFERENCES "post_budget_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_coa_tags" ADD CONSTRAINT "FK_e37d4ca20458760bb96b766fcd7" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activity_coa_tags" DROP CONSTRAINT "FK_e37d4ca20458760bb96b766fcd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "FK_6bf41fbc3395df07f01a1ad53af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "FK_c4921e1c3481ee3b77dda14021e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_framework_contracts" DROP CONSTRAINT "FK_accb62b2238f4e2890d65248534"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP CONSTRAINT "FK_a6677a7b07c81a0fc2f29cac6ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP CONSTRAINT "FK_eff837980d4ca10a4823ad88c8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_coa_tags" DROP CONSTRAINT "FK_dc219e070ba9a42c331c6786551"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_coa_tags" DROP CONSTRAINT "FK_f0bfe484fc00491880170bd414f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP CONSTRAINT "FK_baa782e204cae5e8f24d9d504b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP CONSTRAINT "FK_7cc9c3e08beb3e05f5a797f74a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "FK_dd605e373c37b79e86f0ed25ef8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP CONSTRAINT "FK_f7e5b79677a71719df88a30f39d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP CONSTRAINT "FK_5c919265e7d992ac5df09a37de1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_framework_contracts" DROP CONSTRAINT "FK_3dd37af8fe745749ec984bc3366"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budge_plan_disbursements" DROP CONSTRAINT "FK_551437d4ddb1b61bebb819fa6ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP CONSTRAINT "FK_f819bc1f8aed832e4cf8d631498"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP CONSTRAINT "FK_ced404d8f6a5ee69c4cbc7fb2aa"`,
    );
    await queryRunner.query(`DROP TABLE "activity_coa_tags"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_activities"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_disbursements"`);
    await queryRunner.query(
      `DROP TABLE "post_budget_plan_framework_contracts"`,
    );
    await queryRunner.query(`DROP TABLE "post_budget_plan_timelines"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_items"`);
    await queryRunner.query(`DROP TABLE "item_coa_tags"`);
    await queryRunner.query(`DROP TABLE "post_budget_plans"`);
    await queryRunner.query(`DROP TABLE "apps"`);
    await queryRunner.query(`DROP TABLE "budget"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plans"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_activities"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_framework_contracts"`);
    await queryRunner.query(`DROP TABLE "pre_budge_plan_disbursements"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_timelines"`);
    await queryRunner.query(`DROP TABLE "pre_budget_plan_items"`);
  }
}

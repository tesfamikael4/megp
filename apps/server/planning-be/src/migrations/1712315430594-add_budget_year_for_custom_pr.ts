import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBudgetYearForCustomPr1712315430594
  implements MigrationInterface
{
  name = 'AddBudgetYearForCustomPr1712315430594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD "procurementRequisitionId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "budgetYearId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "PK_8685ab6b89ae9fe4d5319ab84ad" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "UQ_80a238a65e77152cca669d86c44" UNIQUE ("procurementRequisitionId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" ADD CONSTRAINT "PK_9c166d52ffb1af4db4ceb248318" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD CONSTRAINT "PK_3143ba6632f2ac09e6ddc49affb" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD CONSTRAINT "PK_8bd9d206621978b131bb6b4bb1c" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_requisitioners" ADD CONSTRAINT "PK_6a6614839fcdbeaa72359ea979e" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" ADD CONSTRAINT "PK_49d95b6af49f4b55041b0c5f35a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" ADD CONSTRAINT "UQ_ae8b9786dfaa7518966ba6dfd66" UNIQUE ("preBudgetPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ADD CONSTRAINT "PK_b38f79852be3640ff43a531ade7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD CONSTRAINT "PK_ba14ac2d59cbadf2c44ba8b0fe0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD CONSTRAINT "UQ_7cc9c3e08beb3e05f5a797f74a2" UNIQUE ("appId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" ADD CONSTRAINT "UQ_baa782e204cae5e8f24d9d504b7" UNIQUE ("preBudgetPlanId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" ADD CONSTRAINT "PK_d39f662420c8d751d165609ca0a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" ADD CONSTRAINT "PK_e12dff7ebe51e4ef51c021d5fb7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD CONSTRAINT "PK_98ba5210f2dd5e97b365b409850" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD CONSTRAINT "PK_3dda54c6fb44fcbe3cd067df039" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "PK_41dd25703834ba99114d281adc2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ADD CONSTRAINT "PK_7b3036a7df8c34e65bbbe477aff" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_requisitioners" ADD CONSTRAINT "PK_16a6b7d05e5de2213706e7fc7d2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" ADD CONSTRAINT "PK_82f96fef42f318627f0e9b5d177" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" ADD CONSTRAINT "UQ_a4bec97b4fbe8f711d190e9ad61" UNIQUE ("postBudgetPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "PK_79a334af6584c8ba10c27e751ed" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "UQ_ad1143400a9a09b9b8d52985f1f" UNIQUE ("procurementReference")`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" ADD CONSTRAINT "PK_b8104b87e316aacce0c709000a2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD CONSTRAINT "PK_7a336b2f4838086a7c819a19abc" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD CONSTRAINT "UQ_61fabba5759b9ea169407a38a2d" UNIQUE ("procurementReference")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD CONSTRAINT "PK_c0b820693ceda5635fae94b9ef8" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD CONSTRAINT "UQ_f7e5b79677a71719df88a30f39d" UNIQUE ("appId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD CONSTRAINT "PK_84f3140815adce0064be083ce8b" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" ADD CONSTRAINT "PK_c5121fda0f8268f1f7f84134e19" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "PK_f229fd2ab23693583f54e88df26" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" ADD CONSTRAINT "PK_7ebd3193d73796eec34459c0be1" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD CONSTRAINT "PK_d3f71f6b05ee1e054b474385134" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "PK_6d0ad196f5ce5943ac50e920255" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "UQ_f42e85c831489da44917a4b35c7" UNIQUE ("procurementReference")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "UQ_742abcd7d3c08cdc1fd90b3384b" UNIQUE ("userReference")`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD CONSTRAINT "CHK_55e917dd00e9409c1c2345c977" CHECK ("quantity" >= 0 AND "unitPrice" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD CONSTRAINT "CHK_0106570cfd16ef2a0a26424475" CHECK ("order" >= 0 AND "period" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD CONSTRAINT "CHK_1031eabc8f736b621a8fc0c50f" CHECK ("unitPrice" >= 0 AND "quantity" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD CONSTRAINT "CHK_0e8f039cce33d2fb1bd436a67d" CHECK ("order" >= 0 AND "period" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "CHK_a4b4b08a756e882fffd9c9738d" CHECK ("amount" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "CHK_9ddbcf4ae28780bd9c8cb4ae10" CHECK ("estimatedAmount" >= 0 AND "calculatedAmount" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD CONSTRAINT "CHK_636d1d5db6446b40b50eff36a7" CHECK ("estimatedAmount" >= 0 AND "calculatedAmount" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" ADD CONSTRAINT "CHK_f1c91a09b5ae530e5d8657c05a" CHECK ("startDate" < "endDate")`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" ADD CONSTRAINT "CHK_de228b5963ead33e4a78a504c5" CHECK ("availableBudget" >= 0 AND "obligatedBudget" >= 0 AND "revisedBudget" >= 0 AND "allocatedBudget" >= 0 AND "availableBudget" <= "revisedBudget" AND "obligatedBudget" <= "revisedBudget" )`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "CHK_c79448c957e5208d16d9fba6cb" CHECK ("unitPrice" >= 0 AND "quantity" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD CONSTRAINT "CHK_786f19b5666b9fde9cb85b4120" CHECK ("order" >= 0 AND "period" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" ADD CONSTRAINT "UQ_8c629da7fe47a59122b8610ba2e" UNIQUE ("order", "preBudgetPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" ADD CONSTRAINT "UQ_4f46ad3893047039813d7bb4abb" UNIQUE ("order", "postBudgetPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "UQ_907ed0d7efa729947ccc7930dfc" UNIQUE ("procurementRequisitionId", "itemCode", "currency", "measurement", "deletedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "UQ_0f4c3d64833f192fd6005e3d787" UNIQUE ("organizationId", "itemCode", "deletedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD CONSTRAINT "UQ_ecf1a3af519afd5f18124d4f2b6" UNIQUE ("order", "procurementRequisitionId", "deletedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "UQ_49fb9d574dbc45dd6cd704f0322" UNIQUE ("procurementReference", "deletedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "FK_80a238a65e77152cca669d86c44" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" ADD CONSTRAINT "FK_927692bdb26c6df5886dd3b25f2" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "procurement_requisition_documents" DROP CONSTRAINT "FK_927692bdb26c6df5886dd3b25f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "FK_80a238a65e77152cca669d86c44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "UQ_49fb9d574dbc45dd6cd704f0322"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP CONSTRAINT "UQ_ecf1a3af519afd5f18124d4f2b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "UQ_0f4c3d64833f192fd6005e3d787"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "UQ_907ed0d7efa729947ccc7930dfc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP CONSTRAINT "UQ_4f46ad3893047039813d7bb4abb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP CONSTRAINT "UQ_8c629da7fe47a59122b8610ba2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP CONSTRAINT "CHK_786f19b5666b9fde9cb85b4120"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "CHK_c79448c957e5208d16d9fba6cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "CHK_de228b5963ead33e4a78a504c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP CONSTRAINT "CHK_f1c91a09b5ae530e5d8657c05a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP CONSTRAINT "CHK_636d1d5db6446b40b50eff36a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "CHK_9ddbcf4ae28780bd9c8cb4ae10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "CHK_a4b4b08a756e882fffd9c9738d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP CONSTRAINT "CHK_0e8f039cce33d2fb1bd436a67d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP CONSTRAINT "CHK_1031eabc8f736b621a8fc0c50f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP CONSTRAINT "CHK_0106570cfd16ef2a0a26424475"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP CONSTRAINT "CHK_55e917dd00e9409c1c2345c977"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "UQ_742abcd7d3c08cdc1fd90b3384b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "UQ_f42e85c831489da44917a4b35c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "PK_6d0ad196f5ce5943ac50e920255"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP CONSTRAINT "PK_d3f71f6b05ee1e054b474385134"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" DROP CONSTRAINT "PK_7ebd3193d73796eec34459c0be1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "PK_f229fd2ab23693583f54e88df26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget" DROP CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apps" DROP CONSTRAINT "PK_c5121fda0f8268f1f7f84134e19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_years" DROP CONSTRAINT "PK_84f3140815adce0064be083ce8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP CONSTRAINT "UQ_f7e5b79677a71719df88a30f39d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP CONSTRAINT "PK_c0b820693ceda5635fae94b9ef8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP CONSTRAINT "UQ_61fabba5759b9ea169407a38a2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP CONSTRAINT "PK_7a336b2f4838086a7c819a19abc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP CONSTRAINT "PK_b8104b87e316aacce0c709000a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "UQ_ad1143400a9a09b9b8d52985f1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "PK_79a334af6584c8ba10c27e751ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" DROP CONSTRAINT "UQ_a4bec97b4fbe8f711d190e9ad61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_procurement_mechanisms" DROP CONSTRAINT "PK_82f96fef42f318627f0e9b5d177"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_requisitioners" DROP CONSTRAINT "PK_16a6b7d05e5de2213706e7fc7d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP CONSTRAINT "PK_7b3036a7df8c34e65bbbe477aff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "PK_41dd25703834ba99114d281adc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_timelines" DROP CONSTRAINT "PK_3dda54c6fb44fcbe3cd067df039"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP CONSTRAINT "PK_98ba5210f2dd5e97b365b409850"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_line" DROP CONSTRAINT "PK_e12dff7ebe51e4ef51c021d5fb7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activity_budget_lines" DROP CONSTRAINT "PK_d39f662420c8d751d165609ca0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP CONSTRAINT "UQ_baa782e204cae5e8f24d9d504b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP CONSTRAINT "UQ_7cc9c3e08beb3e05f5a797f74a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plans" DROP CONSTRAINT "PK_ba14ac2d59cbadf2c44ba8b0fe0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" DROP CONSTRAINT "PK_b38f79852be3640ff43a531ade7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" DROP CONSTRAINT "UQ_ae8b9786dfaa7518966ba6dfd66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_procurement_mechanisms" DROP CONSTRAINT "PK_49d95b6af49f4b55041b0c5f35a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_requisitioners" DROP CONSTRAINT "PK_6a6614839fcdbeaa72359ea979e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_timelines" DROP CONSTRAINT "PK_8bd9d206621978b131bb6b4bb1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP CONSTRAINT "PK_3143ba6632f2ac09e6ddc49affb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" DROP CONSTRAINT "PK_9c166d52ffb1af4db4ceb248318"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "UQ_80a238a65e77152cca669d86c44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "PK_8685ab6b89ae9fe4d5319ab84ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "budgetYearId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasons" DROP COLUMN "procurementRequisitionId"`,
    );
  }
}

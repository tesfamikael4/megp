import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeToDecimalPlace1704872645130 implements MigrationInterface {
  name = 'ChangeToDecimalPlace1704872645130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "unitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "unitPrice" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "estimatedAmount" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "calculatedAmount" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "unitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "unitPrice" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "estimatedAmount" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "calculatedAmount" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "calculatedAmount" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "estimatedAmount" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "unitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "unitPrice" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "calculatedAmount" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP COLUMN "estimatedAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD "estimatedAmount" bigint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "unitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "unitPrice" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plans" ADD "calculatedAmount" json NOT NULL DEFAULT '0'`,
    );
  }
}

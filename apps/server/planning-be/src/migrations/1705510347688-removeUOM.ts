import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUOM1705510347688 implements MigrationInterface {
  name = 'RemoveUOM1705510347688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "uom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "classification" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ALTER COLUMN "itemCode" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "quantity" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ALTER COLUMN "itemCode" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "quantity" numeric NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "quantity" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ALTER COLUMN "itemCode" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "quantity" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ALTER COLUMN "itemCode" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "classification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_items" ADD "uom" character varying NOT NULL`,
    );
  }
}

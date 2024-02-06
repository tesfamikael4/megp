import { MigrationInterface, QueryRunner } from 'typeorm';

export class PrAddFields1707173339255 implements MigrationInterface {
  name = 'PrAddFields1707173339255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_items" DROP COLUMN "uoM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "procurementType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "deliveryDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_items" ADD "uomName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_timelines" ADD "period" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_items" ALTER COLUMN "measurement" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_timelines" ALTER COLUMN "noOfDays" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_timelines" ALTER COLUMN "noOfDays" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_items" ALTER COLUMN "measurement" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_timelines" DROP COLUMN "period"`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_items" DROP COLUMN "uomName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "deliveryDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "procurementType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "annual_procurement_plan_items" ADD "uoM" character varying NOT NULL`,
    );
  }
}

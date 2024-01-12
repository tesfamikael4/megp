import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeTimelineAsString1704957249320 implements MigrationInterface {
  name = 'MakeTimelineAsString1704957249320';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "UQ_7112c6cc85062dec70c5e9cb890"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP COLUMN "timeline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD "timeline" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "UQ_9449b64bf0d34d6f457b5c083fa" UNIQUE ("procurementRequisitionId", "itemCode")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "UQ_9449b64bf0d34d6f457b5c083fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP COLUMN "timeline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD "timeline" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "UQ_7112c6cc85062dec70c5e9cb890" UNIQUE ("itemCode", "currency", "measurement", "procurementRequisitionId")`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomUuidForItem1704073648386 implements MigrationInterface {
  name = 'CustomUuidForItem1704073648386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP CONSTRAINT "UQ_8a4c06c7511ae4d88b8165ccc90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD CONSTRAINT "UQ_e13d8b4828d3e24df1220a0143a" UNIQUE ("annualProcurementPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP COLUMN "order"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD "order" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP COLUMN "noOfDays"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD "noOfDays" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_item_references" DROP CONSTRAINT "FK_3b24db89895d3c821d737db0cc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_mechanisms" ALTER COLUMN "isOnline" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_item_references" ADD CONSTRAINT "FK_3b24db89895d3c821d737db0cc4" FOREIGN KEY ("procurementRequisitionItemId") REFERENCES "procurement_requisition_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_item_references" DROP CONSTRAINT "FK_3b24db89895d3c821d737db0cc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_mechanisms" ALTER COLUMN "isOnline" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_item_references" ADD CONSTRAINT "FK_3b24db89895d3c821d737db0cc4" FOREIGN KEY ("procurementRequisitionItemId") REFERENCES "procurement_requisition_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP COLUMN "noOfDays"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD "noOfDays" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP COLUMN "order"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD "order" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP CONSTRAINT "UQ_e13d8b4828d3e24df1220a0143a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD CONSTRAINT "UQ_8a4c06c7511ae4d88b8165ccc90" UNIQUE ("procurementRequisitionId", "annualProcurementPlanActivityId")`,
    );
  }
}

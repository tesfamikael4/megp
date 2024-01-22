import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUniqDeletedAt1705392410635 implements MigrationInterface {
  name = 'MakeUniqDeletedAt1705392410635';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "UQ_7112c6cc85062dec70c5e9cb890"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "UQ_db94e8e7549b25864e2534909d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP CONSTRAINT "UQ_e13d8b4828d3e24df1220a0143a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD CONSTRAINT "UQ_79023dd383cec6f0bf6792a8f25" UNIQUE ("annualProcurementPlanActivityId", "deletedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "UQ_907ed0d7efa729947ccc7930dfc" UNIQUE ("procurementRequisitionId", "itemCode", "currency", "measurement", "deletedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "UQ_8de92de1a5fbc16aad127af318a" UNIQUE ("userReferenceNumber", "requisitionReferenceNumber", "deletedAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "UQ_8de92de1a5fbc16aad127af318a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "UQ_907ed0d7efa729947ccc7930dfc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP CONSTRAINT "UQ_79023dd383cec6f0bf6792a8f25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD CONSTRAINT "UQ_e13d8b4828d3e24df1220a0143a" UNIQUE ("annualProcurementPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "UQ_db94e8e7549b25864e2534909d1" UNIQUE ("requisitionReferenceNumber", "userReferenceNumber")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "UQ_7112c6cc85062dec70c5e9cb890" UNIQUE ("itemCode", "currency", "measurement", "procurementRequisitionId")`,
    );
  }
}

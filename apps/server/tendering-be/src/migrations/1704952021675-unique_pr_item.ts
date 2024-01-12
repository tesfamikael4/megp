import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniquePrItem1704952021675 implements MigrationInterface {
  name = 'UniquePrItem1704952021675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "UQ_9449b64bf0d34d6f457b5c083fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "UQ_7112c6cc85062dec70c5e9cb890" UNIQUE ("procurementRequisitionId", "itemCode", "currency", "measurement")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "UQ_7112c6cc85062dec70c5e9cb890"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "UQ_9449b64bf0d34d6f457b5c083fa" UNIQUE ("itemCode", "procurementRequisitionId")`,
    );
  }
}

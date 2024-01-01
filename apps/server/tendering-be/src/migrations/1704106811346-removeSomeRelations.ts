import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveSomeRelations1704106811346 implements MigrationInterface {
  name = 'RemoveSomeRelations1704106811346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_item_references" DROP CONSTRAINT "FK_3b24db89895d3c821d737db0cc4"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_item_references" ADD CONSTRAINT "FK_3b24db89895d3c821d737db0cc4" FOREIGN KEY ("procurementRequisitionItemId") REFERENCES "procurement_requisition_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

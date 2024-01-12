import { MigrationInterface, QueryRunner } from 'typeorm';

export class OneToManyRelations1705057456082 implements MigrationInterface {
  name = 'OneToManyRelations1705057456082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP CONSTRAINT "FK_2a6c4b46c333e2320278bad7340"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP CONSTRAINT "REL_2a6c4b46c333e2320278bad734"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD CONSTRAINT "FK_2a6c4b46c333e2320278bad7340" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP CONSTRAINT "FK_2a6c4b46c333e2320278bad7340"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD CONSTRAINT "REL_2a6c4b46c333e2320278bad734" UNIQUE ("procurementRequisitionId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD CONSTRAINT "FK_2a6c4b46c333e2320278bad7340" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

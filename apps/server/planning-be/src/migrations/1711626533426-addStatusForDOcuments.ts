import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusForDOcuments1711626533426 implements MigrationInterface {
  name = 'AddStatusForDOcuments1711626533426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" ADD "title" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" DROP COLUMN "title"`,
    );
  }
}

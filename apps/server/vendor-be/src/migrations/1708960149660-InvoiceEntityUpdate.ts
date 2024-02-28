import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvoiceEntityUpdate1708960149660 implements MigrationInterface {
  name = 'InvoiceEntityUpdate1708960149660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "refNumber" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "refNumber"`);
  }
}

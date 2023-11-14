import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1699875430727 implements MigrationInterface {
  name = 'Initial1699875430727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "isrVendorId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "isrVendorId" character varying`,
    );
  }
}

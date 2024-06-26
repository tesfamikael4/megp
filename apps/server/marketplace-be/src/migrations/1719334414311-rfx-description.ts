import { MigrationInterface, QueryRunner } from 'typeorm';

export class RfxDescription1719334414311 implements MigrationInterface {
  name = 'RfxDescription1719334414311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfxes" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rfxes" DROP COLUMN "description"`);
  }
}

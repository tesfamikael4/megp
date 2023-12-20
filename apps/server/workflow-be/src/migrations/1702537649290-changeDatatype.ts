import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDatatype1702537649290 implements MigrationInterface {
  name = 'ChangeDatatype1702537649290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "approvers"`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approvers" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "approvers"`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approvers" jsonb array NOT NULL`,
    );
  }
}

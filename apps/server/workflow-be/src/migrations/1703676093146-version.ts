import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1703676093146 implements MigrationInterface {
  name = 'Version1703676093146';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "version" integer NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "version"`);
  }
}

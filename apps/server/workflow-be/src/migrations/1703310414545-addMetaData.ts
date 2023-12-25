import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetaData1703310414545 implements MigrationInterface {
  name = 'AddMetaData1703310414545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "workflows" DROP COLUMN "metadata"`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "metadata" jsonb NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "metadata"`);
    await queryRunner.query(
      `ALTER TABLE "workflows" ADD "metadata" jsonb NOT NULL`,
    );
  }
}

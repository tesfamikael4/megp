import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnItemEntity1716800685256 implements MigrationInterface {
  name = 'UpdateOnItemEntity1716800685256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "status"`);
  }
}

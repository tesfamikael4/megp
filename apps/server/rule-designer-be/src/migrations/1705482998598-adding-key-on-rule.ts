import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingKeyOnRule1705482998598 implements MigrationInterface {
  name = 'AddingKeyOnRule1705482998598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rules" ADD "key" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "UQ_59ada20b6a7bc62a73d0626dbdb" UNIQUE ("key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "UQ_59ada20b6a7bc62a73d0626dbdb"`,
    );
    await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "key"`);
  }
}

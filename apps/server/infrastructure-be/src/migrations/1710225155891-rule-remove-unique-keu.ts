import { MigrationInterface, QueryRunner } from 'typeorm';

export class RuleRemoveUniqueKeu1710225155891 implements MigrationInterface {
  name = 'RuleRemoveUniqueKeu1710225155891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "UQ_f2ce86bfe9dbf7eade88605a803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "UQ_59ada20b6a7bc62a73d0626dbdb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "UQ_f2ce86bfe9dbf7eade88605a803" UNIQUE ("key", "designerId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "UQ_f2ce86bfe9dbf7eade88605a803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "UQ_59ada20b6a7bc62a73d0626dbdb" UNIQUE ("key")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "UQ_f2ce86bfe9dbf7eade88605a803" UNIQUE ("key", "designerId")`,
    );
  }
}

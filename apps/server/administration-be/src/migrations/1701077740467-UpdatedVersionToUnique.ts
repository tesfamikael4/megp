import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedVersionToUnique1701077740467 implements MigrationInterface {
  name = 'UpdatedVersionToUnique1701077740467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taxonomy_code_sets" ADD CONSTRAINT "UQ_41c4901db2ce4ee9e5e89361fdd" UNIQUE ("version")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taxonomy_code_sets" DROP CONSTRAINT "UQ_41c4901db2ce4ee9e5e89361fdd"`,
    );
  }
}

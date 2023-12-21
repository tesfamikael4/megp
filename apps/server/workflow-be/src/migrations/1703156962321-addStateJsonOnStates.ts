import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStateJsonOnStates1703156962321 implements MigrationInterface {
  name = 'AddStateJsonOnStates1703156962321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "states" ADD "state" jsonb NOT NULL`);
    await queryRunner.query(`ALTER TABLE "workflows" DROP COLUMN "metadata"`);
    await queryRunner.query(
      `ALTER TABLE "workflows" ADD "metadata" jsonb NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "workflows" DROP COLUMN "metadata"`);
    await queryRunner.query(
      `ALTER TABLE "workflows" ADD "metadata" json NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "state"`);
  }
}

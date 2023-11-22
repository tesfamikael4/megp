import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnGroup1700637993387 implements MigrationInterface {
  name = 'UpdateOnGroup1700637993387';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "groups" DROP COLUMN "descriptionJson"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "groups" ADD "descriptionJson" jsonb`);
  }
}

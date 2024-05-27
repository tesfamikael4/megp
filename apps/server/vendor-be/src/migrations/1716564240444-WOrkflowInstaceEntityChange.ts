import { MigrationInterface, QueryRunner } from 'typeorm';

export class WOrkflowInstaceEntityChange1716564240444
  implements MigrationInterface
{
  name = 'WOrkflowInstaceEntityChange1716564240444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brifecases" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "brifecases" ADD "name" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "brifecases" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "brifecases" DROP COLUMN "description"`,
    );
  }
}

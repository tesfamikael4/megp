import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreferentialTreatmentEntityUpdate1705384552272
  implements MigrationInterface
{
  name = 'PreferentialTreatmentEntityUpdate1705384552272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "certiNumber" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "certiNumber"`,
    );
  }
}

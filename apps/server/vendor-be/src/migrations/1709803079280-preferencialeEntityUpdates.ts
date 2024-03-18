import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreferencialeEntityUpdates1709803079280
  implements MigrationInterface
{
  name = 'PreferencialeEntityUpdates1709803079280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "vendorId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "vendorId" uuid NOT NULL`,
    );
  }
}

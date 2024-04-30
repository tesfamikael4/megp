import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBdsGeneralEntity1714400355814
  implements MigrationInterface
{
  name = 'UpdateOnBdsGeneralEntity1714400355814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP COLUMN "maximumPercentageContractingAllowed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD "maximumPercentageContractingAllowed" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP COLUMN "maximumPercentageContractingAllowed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD "maximumPercentageContractingAllowed" boolean NOT NULL`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnSCCGeneralProvisin1716896206822
  implements MigrationInterface
{
  name = 'UpdateOnSCCGeneralProvisin1716896206822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scc_general_provisions" ADD "contractType" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scc_general_provisions" DROP COLUMN "contractType"`,
    );
  }
}

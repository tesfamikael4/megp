import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderUniqueness1720276702184
  implements MigrationInterface
{
  name = 'UpdateOnTenderUniqueness1720276702184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" DROP CONSTRAINT "UQ_ad826bdfb5fd63982167a240359"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD CONSTRAINT "UQ_ad826bdfb5fd63982167a240359" UNIQUE ("prId")`,
    );
  }
}

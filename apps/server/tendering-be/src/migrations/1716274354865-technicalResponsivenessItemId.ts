import { MigrationInterface, QueryRunner } from 'typeorm';

export class TechnicalResponsivenessItemId1716274354865
  implements MigrationInterface
{
  name = 'TechnicalResponsivenessItemId1716274354865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessments" ADD "itemId" uuid NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessments" DROP COLUMN "itemId"`,
    );
  }
}

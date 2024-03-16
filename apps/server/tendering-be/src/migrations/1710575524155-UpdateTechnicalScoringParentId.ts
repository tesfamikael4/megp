import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTechnicalScoringParentId1710575524155
  implements MigrationInterface
{
  name = 'UpdateTechnicalScoringParentId1710575524155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ALTER COLUMN "parentId" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ALTER COLUMN "parentId" SET NOT NULL`,
    );
  }
}

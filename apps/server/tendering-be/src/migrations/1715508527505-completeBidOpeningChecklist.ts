import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteBidOpeningChecklist1715508527505
  implements MigrationInterface
{
  name = 'CompleteBidOpeningChecklist1715508527505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "complete" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "complete"`,
    );
  }
}

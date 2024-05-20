import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteDefaultValue1715513423902 implements MigrationInterface {
  name = 'CompleteDefaultValue1715513423902';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ALTER COLUMN "complete" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ALTER COLUMN "submit" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ALTER COLUMN "submit" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ALTER COLUMN "complete" DROP DEFAULT`,
    );
  }
}

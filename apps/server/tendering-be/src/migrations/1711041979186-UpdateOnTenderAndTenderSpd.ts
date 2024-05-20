import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderAndTenderSpd1711041979186
  implements MigrationInterface
{
  name = 'UpdateOnTenderAndTenderSpd1711041979186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tender_spds" ADD "bds" jsonb`);
    await queryRunner.query(`ALTER TABLE "tender_spds" ADD "scc" jsonb`);
    await queryRunner.query(`ALTER TABLE "tenders" ADD "tenderDocument" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" DROP COLUMN "tenderDocument"`,
    );
    await queryRunner.query(`ALTER TABLE "tender_spds" DROP COLUMN "scc"`);
    await queryRunner.query(`ALTER TABLE "tender_spds" DROP COLUMN "bds"`);
  }
}

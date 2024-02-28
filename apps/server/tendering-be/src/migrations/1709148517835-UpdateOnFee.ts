import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnFee1709148517835 implements MigrationInterface {
  name = 'UpdateOnFee1709148517835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sor_fees" ALTER COLUMN "staffMonthRate" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sor_fees" ALTER COLUMN "staffMonthRate" SET NOT NULL`,
    );
  }
}

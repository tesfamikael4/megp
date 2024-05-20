import { MigrationInterface, QueryRunner } from 'typeorm';

export class TechnicalItemsArray1716229031288 implements MigrationInterface {
  name = 'TechnicalItemsArray1716229031288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "technicalItems"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "technicalItems" text array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "technicalItems"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "technicalItems" text`,
    );
  }
}

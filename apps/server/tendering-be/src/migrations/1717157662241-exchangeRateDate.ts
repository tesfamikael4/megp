import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExchangeRateDate1717157662241 implements MigrationInterface {
  name = 'ExchangeRateDate1717157662241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "exchange_rates" DROP COLUMN "rate"`);
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" DROP COLUMN "foreignCurrency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" DROP COLUMN "localCurrency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" ADD "dateOfConversion" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" ADD "source" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" DROP COLUMN "source"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" DROP COLUMN "dateOfConversion"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" ADD "localCurrency" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" ADD "foreignCurrency" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rates" ADD "rate" integer NOT NULL`,
    );
  }
}

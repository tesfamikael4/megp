import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExchangeRate1717155921959 implements MigrationInterface {
  name = 'ExchangeRate1717155921959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exchange_rate_details" DROP CONSTRAINT "FK_80cdac97730156066ab700349b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rate_details" DROP COLUMN "lotId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exchange_rate_details" ADD "lotId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "exchange_rate_details" ADD CONSTRAINT "FK_80cdac97730156066ab700349b8" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvoiceEntityUpdates1709710709380 implements MigrationInterface {
  name = 'InvoiceEntityUpdates1709710709380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_0283ff39f20d2c469adee56c71f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "UQ_0283ff39f20d2c469adee56c71f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "businessAreaId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "applicationNo"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "pricingId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "pricingId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "applicationNo" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" ADD "businessAreaId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "UQ_0283ff39f20d2c469adee56c71f" UNIQUE ("businessAreaId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_0283ff39f20d2c469adee56c71f" FOREIGN KEY ("businessAreaId") REFERENCES "business_areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

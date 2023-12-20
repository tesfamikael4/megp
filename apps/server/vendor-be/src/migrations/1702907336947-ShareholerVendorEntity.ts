import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShareholerVendorEntity1702907336947 implements MigrationInterface {
  name = 'ShareholerVendorEntity1702907336947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" DROP CONSTRAINT "FK_5b926a7c29cb4b0a8e68310c2cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" DROP CONSTRAINT "REL_5b926a7c29cb4b0a8e68310c2c"`,
    );
    await queryRunner.query(`ALTER TABLE "isr_vendors" DROP COLUMN "vendorId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "isr_vendors" ADD "vendorId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ADD CONSTRAINT "REL_5b926a7c29cb4b0a8e68310c2c" UNIQUE ("vendorId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ADD CONSTRAINT "FK_5b926a7c29cb4b0a8e68310c2cf" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

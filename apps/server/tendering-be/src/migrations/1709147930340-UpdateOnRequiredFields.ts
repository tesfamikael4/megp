import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnRequiredFields1709147930340 implements MigrationInterface {
  name = 'UpdateOnRequiredFields1709147930340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" ALTER COLUMN "rate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" ALTER COLUMN "amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_fees" ALTER COLUMN "rate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_incidental_costs" ALTER COLUMN "rate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_incidental_costs" ALTER COLUMN "amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_labors" ALTER COLUMN "rate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_labors" ALTER COLUMN "amount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ALTER COLUMN "rate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ALTER COLUMN "amount" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ALTER COLUMN "amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ALTER COLUMN "rate" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_labors" ALTER COLUMN "amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_labors" ALTER COLUMN "rate" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_incidental_costs" ALTER COLUMN "amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_incidental_costs" ALTER COLUMN "rate" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_fees" ALTER COLUMN "rate" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" ALTER COLUMN "amount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" ALTER COLUMN "rate" SET NOT NULL`,
    );
  }
}

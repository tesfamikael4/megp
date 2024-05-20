import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderingModel1710592937953 implements MigrationInterface {
  name = 'UpdateOnTenderingModel1710592937953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "itemType"`);
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ALTER COLUMN "invitationType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ALTER COLUMN "marketApproach" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ALTER COLUMN "stageType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ALTER COLUMN "stage" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "marketPrice" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "marketPriceCurrency" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "marketPriceCurrency" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "marketPrice" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ALTER COLUMN "stage" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ALTER COLUMN "stageType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ALTER COLUMN "marketApproach" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ALTER COLUMN "invitationType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD "itemType" character varying NOT NULL`,
    );
  }
}

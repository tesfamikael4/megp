import { MigrationInterface, QueryRunner } from 'typeorm';

export class SplitOrginaztionJson1718891944474 implements MigrationInterface {
  name = 'SplitOrginaztionJson1718891944474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" DROP COLUMN "vendor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" ADD "vendorId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" ADD "vendorName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" ADD "beneficiaryId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" ADD "beneficiaryName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" ALTER COLUMN "vendorId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" ALTER COLUMN "vendorName" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" ALTER COLUMN "vendorName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" ALTER COLUMN "vendorId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" DROP COLUMN "beneficiaryName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" DROP COLUMN "beneficiaryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" DROP COLUMN "vendorName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" DROP COLUMN "vendorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" ADD "organizationName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" ADD "organizationId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" ADD "vendor" jsonb NOT NULL`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SplitOrganizationJson1718957756194 implements MigrationInterface {
  name = 'SplitOrganizationJson1718957756194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" DROP COLUMN "vendor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" DROP COLUMN "organization"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" DROP COLUMN "vendor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" DROP COLUMN "organization"`,
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
      `ALTER TABLE "contract_catalogs" ADD "organizationId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" ADD "organizationName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" ADD "vendorId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" ADD "vendorName" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" DROP COLUMN "vendorName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" DROP COLUMN "vendorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" DROP COLUMN "organizationId"`,
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
      `ALTER TABLE "contract_catalogs" ADD "organization" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_catalogs" ADD "vendor" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" ADD "organization" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" ADD "vendor" jsonb NOT NULL`,
    );
  }
}

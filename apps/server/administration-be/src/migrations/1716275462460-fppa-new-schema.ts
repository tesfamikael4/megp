import { MigrationInterface, QueryRunner } from 'typeorm';

export class FppaNewSchema1716275462460 implements MigrationInterface {
  name = 'FppaNewSchema1716275462460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."fppa_business_area_category_enum" AS ENUM('GOODS', 'SERVICES')`,
    );
    await queryRunner.query(
      `CREATE TABLE "fppa_business_area" ("id" SERIAL NOT NULL, "category" "public"."fppa_business_area_category_enum" NOT NULL, "from" integer NOT NULL DEFAULT '0', "to" integer, "fppaVendorId" integer NOT NULL, CONSTRAINT "UQ_8ce16e2e1ec3a9d8385122eb643" UNIQUE ("category", "fppaVendorId"), CONSTRAINT "PK_72eece91301ad5004c3a2dd429c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "tin"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "accountNo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "emailOfficial" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "website" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "businessTelephone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "postalAddress" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "businessPremise" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "expireDate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "signature" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "branchName" numeric(15,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "accountNumber" numeric(15,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "tradingName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "companyTin" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD CONSTRAINT "UQ_00bc06005651693c2872fe3b347" UNIQUE ("companyTin")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "numberEmployeesStaff" numeric(15,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "shareholderFirstName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "ShareholderLastName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "gender" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "contactNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "nationality" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "businessLocation" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "country" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "supplierStatus" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "applicationType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "dgApproval" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "bankName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "accountType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "currency" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "msmeType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP CONSTRAINT "PK_5ab0c3e8894943e8ef98d3fe7a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD CONSTRAINT "PK_5ab0c3e8894943e8ef98d3fe7a0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "supplierCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "supplierCode" numeric(15,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ALTER COLUMN "supplierName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ALTER COLUMN "mobileNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ALTER COLUMN "accountName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ALTER COLUMN "businessType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_business_area" ADD CONSTRAINT "FK_dd06fe7f2e5678e9f0d72a9adef" FOREIGN KEY ("fppaVendorId") REFERENCES "fppa_vendors_infos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fppa_business_area" DROP CONSTRAINT "FK_dd06fe7f2e5678e9f0d72a9adef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ALTER COLUMN "businessType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ALTER COLUMN "accountName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ALTER COLUMN "mobileNumber" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ALTER COLUMN "supplierName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "supplierCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "supplierCode" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP CONSTRAINT "PK_5ab0c3e8894943e8ef98d3fe7a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD CONSTRAINT "PK_5ab0c3e8894943e8ef98d3fe7a0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "msmeType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "accountType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "bankName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "dgApproval"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "applicationType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "supplierStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "country"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "businessLocation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "nationality"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "contactNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "gender"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "ShareholderLastName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "shareholderFirstName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "numberEmployeesStaff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP CONSTRAINT "UQ_00bc06005651693c2872fe3b347"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "companyTin"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "tradingName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "accountNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "branchName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "signature"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "expireDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "businessPremise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "postalAddress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "businessTelephone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "website"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "emailOfficial"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "accountNo" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "tin" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "fppa_business_area"`);
    await queryRunner.query(
      `DROP TYPE "public"."fppa_business_area_category_enum"`,
    );
  }
}

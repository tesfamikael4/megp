import { MigrationInterface, QueryRunner } from 'typeorm';

export class DataExchangeApi1701674789588 implements MigrationInterface {
  name = 'DataExchangeApi1701674789588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customer_bussines_infos" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tin" character varying NOT NULL, "businessLicenseNumber" character varying NOT NULL, "nationality" character varying NOT NULL, "legalStatus" character varying NOT NULL, "businessName" character varying NOT NULL, "dateRegistered" TIMESTAMP NOT NULL, "organizationName" character varying NOT NULL, "firstName" character varying NOT NULL, "middleName" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "PK_60826d933f8f7f7133f2a7979ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "budget_categories" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_2159c4d6372542f4629c4149045" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fppa_vendors_infos" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tin" character varying NOT NULL, "supplierCode" character varying NOT NULL, "supplierName" character varying NOT NULL, "businessType" character varying NOT NULL, "accountNo" character varying NOT NULL, "accountName" character varying NOT NULL, "mobileNumber" character varying NOT NULL, CONSTRAINT "PK_5ab0c3e8894943e8ef98d3fe7a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tax_payers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tin" character varying NOT NULL, "taxpayerName" character varying NOT NULL, "tradingNames" text NOT NULL, "postalAddress" character varying NOT NULL, "businessSectorISIC" character varying NOT NULL, "taxpayerSegment" character varying NOT NULL, "registrationDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_b7afd31698cc43db7eb654e3817" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ncic_vendors" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tin" character varying NOT NULL, "nameOfFirm" character varying NOT NULL, "postalAddress" character varying NOT NULL, "telephoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "nationalOfFirm" character varying NOT NULL, "typeOfRegistration" character varying NOT NULL, "branch" character varying NOT NULL, "category" character varying NOT NULL, "district" character varying NOT NULL, "region" character varying NOT NULL, CONSTRAINT "PK_51500d824ee4d81690d01872665" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ncic_vendors"`);
    await queryRunner.query(`DROP TABLE "tax_payers"`);
    await queryRunner.query(`DROP TABLE "fppa_vendors_infos"`);
    await queryRunner.query(`DROP TABLE "budget_categories"`);
    await queryRunner.query(`DROP TABLE "customer_bussines_infos"`);
  }
}

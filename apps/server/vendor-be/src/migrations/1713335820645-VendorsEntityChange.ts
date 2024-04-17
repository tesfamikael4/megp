import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendorsEntityChange1713335820645 implements MigrationInterface {
  name = 'VendorsEntityChange1713335820645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "beneficial_shareholders" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "vendorId" uuid, "nationality" character varying NOT NULL, "key" character varying, "middleName" character varying, "countryOfResidence" character varying, "share" character varying, "votingRights" character varying, "authorityToAppointGov" character varying, CONSTRAINT "PK_0bf2abbe0810e96bb3dee5f1c1a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" DROP COLUMN "bankSwift"`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" DROP COLUMN "shareHolders"`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" DROP COLUMN "beneficialOwnership"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shareholders" DROP COLUMN "firstName"`,
    );
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "tin"`);
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "origin"`);
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" ADD "swiftCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" ADD "bankType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ADD "beneficialOwnershipShareholders" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "category" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "type" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "certificateValidityPeriod" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "certificateIssuedDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD "userType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD "classification" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD "activationDate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD "expiryDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "shareholders" ADD "firstname" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "tinNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "countryOfRegistration" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "vendors" ADD "lineOfBusiness" json`);
    await queryRunner.query(
      `ALTER TABLE "beneficial_ownership" ADD "middleName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" DROP CONSTRAINT "FK_eba3b410944a08e26a78ff4318d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" ALTER COLUMN "bankId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ALTER COLUMN "initial" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP COLUMN "priceRange"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD "priceRange" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "shareholders" ALTER COLUMN "share" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" ADD CONSTRAINT "FK_eba3b410944a08e26a78ff4318d" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "beneficial_shareholders" ADD CONSTRAINT "FK_8691da0d755125e2a7cfdce1a86" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD CONSTRAINT "FK_4e96a61dcb5cd9da2c944b6a31c" FOREIGN KEY ("priceRange") REFERENCES "service_pricing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP CONSTRAINT "FK_4e96a61dcb5cd9da2c944b6a31c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "beneficial_shareholders" DROP CONSTRAINT "FK_8691da0d755125e2a7cfdce1a86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" DROP CONSTRAINT "FK_eba3b410944a08e26a78ff4318d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shareholders" ALTER COLUMN "share" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP COLUMN "priceRange"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD "priceRange" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ALTER COLUMN "initial" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" ALTER COLUMN "bankId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" ADD CONSTRAINT "FK_eba3b410944a08e26a78ff4318d" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "beneficial_ownership" DROP COLUMN "middleName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" DROP COLUMN "lineOfBusiness"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" DROP COLUMN "countryOfRegistration"`,
    );
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "tinNumber"`);
    await queryRunner.query(
      `ALTER TABLE "shareholders" DROP COLUMN "firstname"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP COLUMN "expiryDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP COLUMN "activationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP COLUMN "classification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP COLUMN "userType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "certificateIssuedDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "certificateValidityPeriod"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" DROP COLUMN "beneficialOwnershipShareholders"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" DROP COLUMN "bankType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" DROP COLUMN "swiftCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "origin" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "tin" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "shareholders" ADD "firstName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ADD "beneficialOwnership" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ADD "shareHolders" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" ADD "bankSwift" character varying`,
    );
    await queryRunner.query(`DROP TABLE "beneficial_shareholders"`);
  }
}

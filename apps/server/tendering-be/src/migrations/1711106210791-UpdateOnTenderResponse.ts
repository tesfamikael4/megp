import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderResponse1711106210791 implements MigrationInterface {
  name = 'UpdateOnTenderResponse1711106210791';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bid_response_tenders" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationId" uuid NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "PK_fd5bb5d22f75d1c67e00c0baffe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "financialResponse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "salt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "response"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "technicalResponse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "envelopType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bid_registration_details_enveloptype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" ADD "financialResponse" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" ADD "technicalResponse" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" ADD "response" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" ADD "salt" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_registrations_enveloptype_enum" AS ENUM('single envelop', 'two envelop')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" ADD "envelopType" "public"."bid_registrations_enveloptype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" ADD CONSTRAINT "FK_51054bf8cee67d1f55d9ec5713d" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" DROP CONSTRAINT "FK_51054bf8cee67d1f55d9ec5713d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" DROP COLUMN "envelopType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bid_registrations_enveloptype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" DROP COLUMN "salt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" DROP COLUMN "response"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" DROP COLUMN "technicalResponse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" DROP COLUMN "financialResponse"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_registration_details_enveloptype_enum" AS ENUM('single envelop', 'two envelop')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "envelopType" "public"."bid_registration_details_enveloptype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "technicalResponse" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "response" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "salt" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "financialResponse" text`,
    );
    await queryRunner.query(`DROP TABLE "bid_response_tenders"`);
  }
}

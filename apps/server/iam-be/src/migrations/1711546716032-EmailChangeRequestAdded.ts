import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmailChangeRequestAdded1711546716032
  implements MigrationInterface
{
  name = 'EmailChangeRequestAdded1711546716032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email_change_requests" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "oldEmail" character varying NOT NULL, "newEmail" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'REQUESTED', "accountId" uuid NOT NULL, CONSTRAINT "PK_bd4c3add2b94c4ee2207d9234d6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."account_verifications_otptype_enum" RENAME TO "account_verifications_otptype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_verifications_otptype_enum" AS ENUM('EMAIL_VERIFICATION', 'RESET_PASSWORD', 'PHONE_VERIFICATION', 'INVITATION', 'CONFIRM_OLD_EMAIL', 'CONFIRM_NEW_EMAIL')`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ALTER COLUMN "otpType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ALTER COLUMN "otpType" TYPE "public"."account_verifications_otptype_enum" USING "otpType"::"text"::"public"."account_verifications_otptype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ALTER COLUMN "otpType" SET DEFAULT 'EMAIL_VERIFICATION'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."account_verifications_otptype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_change_requests" ADD CONSTRAINT "FK_97b90ac92938e61cbe6576fe71d" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email_change_requests" DROP CONSTRAINT "FK_97b90ac92938e61cbe6576fe71d"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_verifications_otptype_enum_old" AS ENUM('EMAIL_VERIFICATION', 'RESET_PASSWORD', 'PHONE_VERIFICATION', 'INVITATION')`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ALTER COLUMN "otpType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ALTER COLUMN "otpType" TYPE "public"."account_verifications_otptype_enum_old" USING "otpType"::"text"::"public"."account_verifications_otptype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ALTER COLUMN "otpType" SET DEFAULT 'EMAIL_VERIFICATION'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."account_verifications_otptype_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."account_verifications_otptype_enum_old" RENAME TO "account_verifications_otptype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "email_change_requests"`);
  }
}

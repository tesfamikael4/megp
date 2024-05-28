import { MigrationInterface, QueryRunner } from 'typeorm';

export class Evaluation1716770964453 implements MigrationInterface {
  name = 'Evaluation1716770964453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."eval_responses_qualified_enum" AS ENUM('COMPLY', 'NOT_COMPLY', 'NOT_APPLICABLE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "eval_responses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isTeamAssesment" boolean NOT NULL DEFAULT false, "qualified" "public"."eval_responses_qualified_enum" NOT NULL, "remark" character varying, "solRegistrationId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "rfxId" uuid NOT NULL, CONSTRAINT "UQ_0e9f1e07ee8418bfb1f8b201756" UNIQUE ("evaluatorId", "rfxId"), CONSTRAINT "PK_eb2b1f051a600d09a5882eb6570" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eval_item_responses_qualified_enum" AS ENUM('COMPLY', 'NOT_COMPLY', 'NOT_APPLICABLE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "eval_item_responses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isTeamAssesment" boolean NOT NULL DEFAULT false, "qualified" "public"."eval_item_responses_qualified_enum" NOT NULL, "remark" character varying, "solRegistrationId" uuid NOT NULL, "rfxProductInvitaitonId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "rfxItemId" uuid NOT NULL, CONSTRAINT "UQ_ff4861e95ce62590529087a9c1e" UNIQUE ("evaluatorId", "rfxProductInvitaitonId"), CONSTRAINT "PK_7c3b0e61927330bda9c0fe3c70a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_product_invitations_status_enum" RENAME TO "rfx_product_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_product_invitations_status_enum" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ACCEPTED', 'DISCARDED', 'WITHDRAWN', 'COMPLY', 'NOT_COMPLY', 'ENDED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ALTER COLUMN "status" TYPE "public"."rfx_product_invitations_status_enum" USING "status"::"text"::"public"."rfx_product_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."rfx_product_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "startingPrice" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."sol_rounds_status_enum" RENAME TO "sol_rounds_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_rounds_status_enum" AS ENUM('PENDING', 'STARTED', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ALTER COLUMN "status" TYPE "public"."sol_rounds_status_enum" USING "status"::"text"::"public"."sol_rounds_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "public"."sol_rounds_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_36fcf8498f3ed637f36efaaeef7" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_b20c2b899ef68805678381ae2c9" FOREIGN KEY ("evaluatorId") REFERENCES "rfx_procurement_technical_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_e245817f9741320e242822d91ed" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_6e176d714741e60ef3df8d406e0" FOREIGN KEY ("evaluatorId") REFERENCES "rfx_procurement_technical_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_7e88c439341b646bde388694b15" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_42b0be36141c1fca48c16f2714a" FOREIGN KEY ("rfxProductInvitaitonId") REFERENCES "rfx_product_invitations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_1d7ec7af0526e3800b44c463993" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_1d7ec7af0526e3800b44c463993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_42b0be36141c1fca48c16f2714a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_7e88c439341b646bde388694b15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_6e176d714741e60ef3df8d406e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_e245817f9741320e242822d91ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_b20c2b899ef68805678381ae2c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_36fcf8498f3ed637f36efaaeef7"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_rounds_status_enum_old" AS ENUM('PENDING', 'STARTED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ALTER COLUMN "status" TYPE "public"."sol_rounds_status_enum_old" USING "status"::"text"::"public"."sol_rounds_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "public"."sol_rounds_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."sol_rounds_status_enum_old" RENAME TO "sol_rounds_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" DROP COLUMN "startingPrice"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_product_invitations_status_enum_old" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ACCEPTED', 'DISCARDED', 'WITHDRAWN', 'ENDED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ALTER COLUMN "status" TYPE "public"."rfx_product_invitations_status_enum_old" USING "status"::"text"::"public"."rfx_product_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."rfx_product_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_product_invitations_status_enum_old" RENAME TO "rfx_product_invitations_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "eval_item_responses"`);
    await queryRunner.query(
      `DROP TYPE "public"."eval_item_responses_qualified_enum"`,
    );
    await queryRunner.query(`DROP TABLE "eval_responses"`);
    await queryRunner.query(
      `DROP TYPE "public"."eval_responses_qualified_enum"`,
    );
  }
}

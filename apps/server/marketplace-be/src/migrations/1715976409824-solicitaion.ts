import { MigrationInterface, QueryRunner } from 'typeorm';

export class Solicitaion1715976409824 implements MigrationInterface {
  name = 'Solicitaion1715976409824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sol_rounds" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "round" integer NOT NULL, "start" TIMESTAMP NOT NULL, "end" TIMESTAMP NOT NULL, CONSTRAINT "PK_4edc48d99d8d49fa0c1b905b1a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_offers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "vendorId" character varying NOT NULL, "price" integer NOT NULL, "roundId" uuid NOT NULL, "roundWinner" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_a3ba29e19163067848d85664095" UNIQUE ("rfxItemId", "vendorId", "roundId"), CONSTRAINT "PK_eda83e4ba056d3a22f6738f22ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_response_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "vendorId" character varying NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_2032b327293bd7a62afcc781a9c" UNIQUE ("rfxItemId", "vendorId", "key"), CONSTRAINT "PK_a6d8194a74ff1ea5751160f87b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_registration_status_enum" AS ENUM('PENDING', 'REGISTERED', 'SUBMITTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_registration" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "vendorId" character varying NOT NULL, "vendorName" character varying NOT NULL, "salt" character varying NOT NULL, "response" character varying NOT NULL, "status" "public"."sol_registration_status_enum" NOT NULL DEFAULT 'REGISTERED', CONSTRAINT "UQ_edc5ba520a6a4a290624d01f2e9" UNIQUE ("rfxId", "vendorId"), CONSTRAINT "PK_c2a02d367b4d6c752a681a9fde1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_bookmark_status_enum" AS ENUM('BOOKMARKED', 'REGISTERED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_bookmark" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "vendorId" character varying NOT NULL, "status" "public"."sol_bookmark_status_enum" NOT NULL DEFAULT 'BOOKMARKED', CONSTRAINT "UQ_ace77b23b548e5ffd21a4a08463" UNIQUE ("rfxId", "vendorId"), CONSTRAINT "PK_6008f4fd194f5b6b5d6b2229ddb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_responses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "registrationId" uuid NOT NULL, "vendorId" character varying NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_438d273ae6903848e3254e73e3a" UNIQUE ("rfxId", "vendorId", "key"), CONSTRAINT "PK_b9d65d1234a013d20d1e51fbfe2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "documents" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "organizationName" character varying`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_bid_invitations_status_enum" RENAME TO "rfx_bid_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_bid_invitations_status_enum" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ACCEPTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" TYPE "public"."rfx_bid_invitations_status_enum" USING "status"::"text"::"public"."rfx_bid_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."rfx_bid_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "submissionDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "submissionDeadline" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "openingDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "openingDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "invitationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "invitationDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT 'false'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" ALTER COLUMN "required" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" ALTER COLUMN "required" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD CONSTRAINT "FK_92b6c44d655ae041fd7f30abc13" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD CONSTRAINT "FK_993a19f978685a13a61f2a5a9ea" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD CONSTRAINT "FK_3ef6e08ff7b0de11e7e4110f88e" FOREIGN KEY ("roundId") REFERENCES "sol_rounds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" ADD CONSTRAINT "FK_d9ef38ae9f0830e41ffaf83c8d3" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_registration" ADD CONSTRAINT "FK_231200a8c44b034c32e6270e312" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_bookmark" ADD CONSTRAINT "FK_582ff21203752e4f955ce3e5c0c" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD CONSTRAINT "FK_ed3f688667dc0d70998c22f3103" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD CONSTRAINT "FK_e2683317ed58e27dc1363c70b86" FOREIGN KEY ("registrationId") REFERENCES "sol_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP CONSTRAINT "FK_e2683317ed58e27dc1363c70b86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP CONSTRAINT "FK_ed3f688667dc0d70998c22f3103"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_bookmark" DROP CONSTRAINT "FK_582ff21203752e4f955ce3e5c0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_registration" DROP CONSTRAINT "FK_231200a8c44b034c32e6270e312"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" DROP CONSTRAINT "FK_d9ef38ae9f0830e41ffaf83c8d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP CONSTRAINT "FK_3ef6e08ff7b0de11e7e4110f88e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP CONSTRAINT "FK_993a19f978685a13a61f2a5a9ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" DROP CONSTRAINT "FK_92b6c44d655ae041fd7f30abc13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" ALTER COLUMN "required" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" ALTER COLUMN "required" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "invitationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "invitationDate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "openingDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "openingDate" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "submissionDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "submissionDeadline" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_bid_invitations_status_enum_old" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" TYPE "public"."rfx_bid_invitations_status_enum_old" USING "status"::"text"::"public"."rfx_bid_invitations_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."rfx_bid_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_bid_invitations_status_enum_old" RENAME TO "rfx_bid_invitations_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "userId"`);
    await queryRunner.query(`DROP TABLE "sol_responses"`);
    await queryRunner.query(`DROP TABLE "sol_bookmark"`);
    await queryRunner.query(`DROP TYPE "public"."sol_bookmark_status_enum"`);
    await queryRunner.query(`DROP TABLE "sol_registration"`);
    await queryRunner.query(
      `DROP TYPE "public"."sol_registration_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "sol_response_items"`);
    await queryRunner.query(`DROP TABLE "sol_offers"`);
    await queryRunner.query(`DROP TABLE "sol_rounds"`);
  }
}

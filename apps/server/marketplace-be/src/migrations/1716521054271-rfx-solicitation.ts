import { MigrationInterface, QueryRunner } from 'typeorm';

export class RfxSolicitation1716521054271 implements MigrationInterface {
  name = 'RfxSolicitation1716521054271';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rfx_technical_requirements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "technicalSpecification" jsonb NOT NULL, "deliverySpecification" jsonb NOT NULL, CONSTRAINT "REL_39156c8f6764cc474148acc381" UNIQUE ("rfxItemId"), CONSTRAINT "PK_1a681fe5e0dd4c5436956b4f6f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_responses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, "vendorId" character varying NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_438d273ae6903848e3254e73e3a" UNIQUE ("rfxId", "vendorId", "key"), CONSTRAINT "PK_b9d65d1234a013d20d1e51fbfe2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_registration_status_enum" AS ENUM('PENDING', 'REGISTERED', 'SUBMITTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_registration" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "vendorId" character varying NOT NULL, "vendorName" character varying NOT NULL, "salt" character varying NOT NULL, "response" character varying NOT NULL, "status" "public"."sol_registration_status_enum" NOT NULL DEFAULT 'REGISTERED', CONSTRAINT "UQ_edc5ba520a6a4a290624d01f2e9" UNIQUE ("rfxId", "vendorId"), CONSTRAINT "PK_c2a02d367b4d6c752a681a9fde1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_offers_status_enum" AS ENUM('PENDING', 'WINNER', 'NEXT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_offers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "vendorId" character varying NOT NULL, "encryptedPrice" character varying NOT NULL, "solRoundId" uuid NOT NULL, "rfxProductInvitationId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, "status" "public"."sol_offers_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "UQ_9b82ee439d8f8c06bbc8e9635de" UNIQUE ("rfxItemId", "vendorId", "solRoundId", "rfxProductInvitationId"), CONSTRAINT "PK_eda83e4ba056d3a22f6738f22ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_product_invitations_status_enum" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ACCEPTED', 'DISCARDED', 'WITHDRAWN', 'ENDED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_product_invitations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "productCatalogueId" character varying NOT NULL, "catalogueSpecificationValues" jsonb NOT NULL, "catalogueImages" jsonb, "catalogueDeliveryValues" jsonb NOT NULL, "vendorId" uuid NOT NULL, "vendorMetadata" jsonb NOT NULL, "status" "public"."rfx_product_invitations_status_enum" NOT NULL DEFAULT 'DRAFT', CONSTRAINT "PK_319efbebd810b94799306f7ddc4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_item_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "fileInfo" jsonb, "title" character varying, "key" character varying NOT NULL, CONSTRAINT "UQ_f4977b96688db2a9e9d3662fedf" UNIQUE ("rfxItemId", "key"), CONSTRAINT "REL_6fe75a765924c57e62a207b2b3" UNIQUE ("rfxItemId"), CONSTRAINT "PK_ea70c89055f97af9c340a5cf9ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_response_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "vendorId" character varying NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_2032b327293bd7a62afcc781a9c" UNIQUE ("rfxItemId", "vendorId", "key"), CONSTRAINT "PK_a6d8194a74ff1ea5751160f87b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_items_status_enum" AS ENUM('DRAFT', 'PENDING', 'INVITATION_PREPARED', 'SUBMITTED', 'APPROVED', 'COMPLETED', 'REJECTED', 'ENDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "isOpen" boolean NOT NULL DEFAULT false, "itemCode" character varying NOT NULL, "itemType" character varying, "procurementCategory" character varying, "name" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "unitOfMeasure" character varying NOT NULL, "estimatedPrice" numeric(10,2) NOT NULL DEFAULT '0', "estimatedPriceCurrency" character varying NOT NULL, "marketPrice" numeric(10,2), "marketPriceCurrency" character varying, "metadata" jsonb, "status" "public"."rfx_items_status_enum" NOT NULL DEFAULT 'DRAFT', CONSTRAINT "PK_d3e9263fac21791f27e6a915f82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "PRRfxProcurementMechanisms" json, CONSTRAINT "REL_0d9b76eba711164360507bd58a" UNIQUE ("rfxId"), CONSTRAINT "PK_4d7fda03d9756544552438d4234" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_procurement_technical_teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "userId" character varying NOT NULL, "userName" character varying, "isTeamLead" boolean NOT NULL, CONSTRAINT "UQ_508b3bcf60467fd1e02211dd7b0" UNIQUE ("rfxId", "userId"), CONSTRAINT "PK_d362707284752e04833668f18d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_bid_procedures" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "bidValidityPeriod" integer NOT NULL, "submissionDeadline" TIMESTAMP NOT NULL, "openingDate" TIMESTAMP NOT NULL, "invitationDate" TIMESTAMP, "deltaPercentage" integer NOT NULL, "isReverseAuction" boolean NOT NULL DEFAULT false, "round" integer NOT NULL DEFAULT '0', "minimumBidDecrementPercentage" integer, "roundDuration" integer, "idleTime" integer, CONSTRAINT "REL_47d8e996a39917bf85802dea87" UNIQUE ("rfxId"), CONSTRAINT "CHK_3aa620f4161754d0a267ee9c5d" CHECK ("minimumBidDecrementPercentage" >= 0 AND "minimumBidDecrementPercentage" < 100), CONSTRAINT "CHK_67e53717b3ef9d87cc22ecfdda" CHECK ("submissionDeadline" > CURRENT_TIMESTAMP), CONSTRAINT "CHK_fb18703f71b89c806e6872c91a" CHECK ("openingDate" > "submissionDeadline"), CONSTRAINT "PK_c27bb53fdd74adae3ad2983bc9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_bid_contract_conditions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "deliveryPeriod" integer NOT NULL, "deliverySite" character varying NOT NULL, "warrantyPeriod" integer NOT NULL, "liquidityDamage" integer NOT NULL DEFAULT '0', "liquidityDamageLimit" integer NOT NULL, "isPartialAllowed" boolean NOT NULL DEFAULT false, "paymentMode" text NOT NULL, "paymentReleasePeriod" integer NOT NULL, CONSTRAINT "REL_32c49aac47c4f33db07493ced2" UNIQUE ("rfxId"), CONSTRAINT "CHK_7353cc50107f0b8c14ba3f7f42" CHECK ("liquidityDamageLimit" >= 0 AND "liquidityDamageLimit" <= 100), CONSTRAINT "CHK_e0e9554979f696710923fe3890" CHECK ("liquidityDamage" >= 0 AND "liquidityDamage" <= 100), CONSTRAINT "CHK_858b331129286d9bf8cd3a7a12" CHECK ("deliveryPeriod" > 0), CONSTRAINT "PK_67e2bc6c5988644e68956012978" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_documentary_evidence" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "documentTitle" character varying NOT NULL, "description" character varying, "required" boolean NOT NULL DEFAULT true, "order" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_3c5caa495cdb5e1af5d882250fb" UNIQUE ("rfxId", "order"), CONSTRAINT "UQ_69201d5b3d93c08df941d0fc243" UNIQUE ("rfxId", "documentTitle"), CONSTRAINT "PK_f154cd5b0ed87adab6db73cec41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_revision_approvals_status_enum" AS ENUM('APPROVED', 'ADJUST')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_revision_approvals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "userId" uuid NOT NULL, "status" "public"."rfx_revision_approvals_status_enum" NOT NULL DEFAULT 'APPROVED', CONSTRAINT "PK_0e4522493719035cdff87a5ae3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_bookmark_status_enum" AS ENUM('BOOKMARKED', 'REGISTERED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_bookmark" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "vendorId" character varying NOT NULL, "status" "public"."sol_bookmark_status_enum" NOT NULL DEFAULT 'BOOKMARKED', CONSTRAINT "UQ_ace77b23b548e5ffd21a4a08463" UNIQUE ("rfxId", "vendorId"), CONSTRAINT "PK_6008f4fd194f5b6b5d6b2229ddb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxs_status_enum" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ENDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfxs" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "procurementCategory" character varying, "procurementReferenceNumber" character varying, "budgetAmount" numeric(14,2) NOT NULL DEFAULT '0', "budgetAmountCurrency" character varying NOT NULL, "budgetCode" character varying NOT NULL, "prId" character varying NOT NULL, "status" "public"."rfxs_status_enum" NOT NULL DEFAULT 'DRAFT', "metadata" jsonb, "organizationId" character varying NOT NULL, "organizationName" character varying NOT NULL, "reviewDeadline" TIMESTAMP, "parentId" uuid, CONSTRAINT "REL_db7d56313d90dbb04a5d22fbd9" UNIQUE ("parentId"), CONSTRAINT "CHK_18df1884946227fe421572e5c6" CHECK ("reviewDeadline" > CURRENT_TIMESTAMP), CONSTRAINT "PK_eab30e14df8f14e83d97ed8f9ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_rounds_status_enum" AS ENUM('PENDING', 'STARTED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_rounds" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "round" integer NOT NULL, "start" TIMESTAMP NOT NULL, "end" TIMESTAMP NOT NULL, "status" "public"."sol_rounds_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "UQ_9bde8c18a8d72c14733a8a4e8f9" UNIQUE ("rfxId", "round"), CONSTRAINT "PK_4edc48d99d8d49fa0c1b905b1a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "fileInfo" jsonb NOT NULL, "itemId" character varying NOT NULL, "type" character varying NOT NULL, "version" integer NOT NULL, "key" character varying NOT NULL, "userId" uuid, "organizationId" uuid, "organizationName" character varying, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_technical_requirements" ADD CONSTRAINT "FK_39156c8f6764cc474148acc381d" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD CONSTRAINT "FK_ed3f688667dc0d70998c22f3103" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD CONSTRAINT "FK_00f55c7f1bd5d3f863160f4c53e" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_registration" ADD CONSTRAINT "FK_231200a8c44b034c32e6270e312" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD CONSTRAINT "FK_993a19f978685a13a61f2a5a9ea" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD CONSTRAINT "FK_a2fbc7b2141d1f5e6801f12e93f" FOREIGN KEY ("solRoundId") REFERENCES "sol_rounds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD CONSTRAINT "FK_3be3c7e1123403a5d3750b3a3d4" FOREIGN KEY ("rfxProductInvitationId") REFERENCES "rfx_product_invitations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD CONSTRAINT "FK_2c8b36df6ca865e230fbc746c9b" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ADD CONSTRAINT "FK_7ec684be7a43451201e2f38b128" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" ADD CONSTRAINT "FK_6fe75a765924c57e62a207b2b37" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" ADD CONSTRAINT "FK_d9ef38ae9f0830e41ffaf83c8d3" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ADD CONSTRAINT "FK_e5a050d3845d0b970b667a419f6" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_procurement_mechanisms" ADD CONSTRAINT "FK_0d9b76eba711164360507bd58aa" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_procurement_technical_teams" ADD CONSTRAINT "FK_fe6817daee630f4a7fb188c25a7" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD CONSTRAINT "FK_47d8e996a39917bf85802dea870" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD CONSTRAINT "FK_32c49aac47c4f33db07493ced2a" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" ADD CONSTRAINT "FK_0a2ff1bee75a00c95fc546c4670" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_revision_approvals" ADD CONSTRAINT "FK_87ecfc632e35405a06cc320b5d7" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_bookmark" ADD CONSTRAINT "FK_582ff21203752e4f955ce3e5c0c" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ADD CONSTRAINT "FK_db7d56313d90dbb04a5d22fbd9e" FOREIGN KEY ("parentId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD CONSTRAINT "FK_92b6c44d655ae041fd7f30abc13" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" DROP CONSTRAINT "FK_92b6c44d655ae041fd7f30abc13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" DROP CONSTRAINT "FK_db7d56313d90dbb04a5d22fbd9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_bookmark" DROP CONSTRAINT "FK_582ff21203752e4f955ce3e5c0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_revision_approvals" DROP CONSTRAINT "FK_87ecfc632e35405a06cc320b5d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" DROP CONSTRAINT "FK_0a2ff1bee75a00c95fc546c4670"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP CONSTRAINT "FK_32c49aac47c4f33db07493ced2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP CONSTRAINT "FK_47d8e996a39917bf85802dea870"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_procurement_technical_teams" DROP CONSTRAINT "FK_fe6817daee630f4a7fb188c25a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_procurement_mechanisms" DROP CONSTRAINT "FK_0d9b76eba711164360507bd58aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" DROP CONSTRAINT "FK_e5a050d3845d0b970b667a419f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" DROP CONSTRAINT "FK_d9ef38ae9f0830e41ffaf83c8d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" DROP CONSTRAINT "FK_6fe75a765924c57e62a207b2b37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" DROP CONSTRAINT "FK_7ec684be7a43451201e2f38b128"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP CONSTRAINT "FK_2c8b36df6ca865e230fbc746c9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP CONSTRAINT "FK_3be3c7e1123403a5d3750b3a3d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP CONSTRAINT "FK_a2fbc7b2141d1f5e6801f12e93f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP CONSTRAINT "FK_993a19f978685a13a61f2a5a9ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_registration" DROP CONSTRAINT "FK_231200a8c44b034c32e6270e312"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP CONSTRAINT "FK_00f55c7f1bd5d3f863160f4c53e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP CONSTRAINT "FK_ed3f688667dc0d70998c22f3103"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_technical_requirements" DROP CONSTRAINT "FK_39156c8f6764cc474148acc381d"`,
    );
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "sol_rounds"`);
    await queryRunner.query(`DROP TYPE "public"."sol_rounds_status_enum"`);
    await queryRunner.query(`DROP TABLE "rfxs"`);
    await queryRunner.query(`DROP TYPE "public"."rfxs_status_enum"`);
    await queryRunner.query(`DROP TABLE "sol_bookmark"`);
    await queryRunner.query(`DROP TYPE "public"."sol_bookmark_status_enum"`);
    await queryRunner.query(`DROP TABLE "rfx_revision_approvals"`);
    await queryRunner.query(
      `DROP TYPE "public"."rfx_revision_approvals_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "rfx_documentary_evidence"`);
    await queryRunner.query(`DROP TABLE "rfx_bid_contract_conditions"`);
    await queryRunner.query(`DROP TABLE "rfx_bid_procedures"`);
    await queryRunner.query(`DROP TABLE "rfx_procurement_technical_teams"`);
    await queryRunner.query(`DROP TABLE "rfx_procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "rfx_items"`);
    await queryRunner.query(`DROP TYPE "public"."rfx_items_status_enum"`);
    await queryRunner.query(`DROP TABLE "sol_response_items"`);
    await queryRunner.query(`DROP TABLE "rfx_item_documents"`);
    await queryRunner.query(`DROP TABLE "rfx_product_invitations"`);
    await queryRunner.query(
      `DROP TYPE "public"."rfx_product_invitations_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "sol_offers"`);
    await queryRunner.query(`DROP TYPE "public"."sol_offers_status_enum"`);
    await queryRunner.query(`DROP TABLE "sol_registration"`);
    await queryRunner.query(
      `DROP TYPE "public"."sol_registration_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "sol_responses"`);
    await queryRunner.query(`DROP TABLE "rfx_technical_requirements"`);
  }
}

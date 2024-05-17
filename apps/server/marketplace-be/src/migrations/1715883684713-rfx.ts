import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rfx1715883684713 implements MigrationInterface {
  name = 'Rfx1715883684713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rfx_technical_requirements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "technicalSpecification" jsonb NOT NULL, "deliverySpecification" jsonb NOT NULL, CONSTRAINT "REL_39156c8f6764cc474148acc381" UNIQUE ("rfxItemId"), CONSTRAINT "PK_1a681fe5e0dd4c5436956b4f6f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_bid_invitations_status_enum" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_bid_invitations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "productCatalogueId" character varying NOT NULL, "catalogueSpecificationValues" jsonb NOT NULL, "catalogueImages" jsonb, "catalogueDeliveryValues" jsonb NOT NULL, "vendorId" uuid NOT NULL, "vendorMetadata" jsonb NOT NULL, "status" "public"."rfx_bid_invitations_status_enum" NOT NULL DEFAULT 'DRAFT', CONSTRAINT "PK_0c51e559e6f0351ce44ec490ecd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_item_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "fileInfo" jsonb, "title" character varying, "key" character varying NOT NULL, CONSTRAINT "UQ_f4977b96688db2a9e9d3662fedf" UNIQUE ("rfxItemId", "key"), CONSTRAINT "REL_6fe75a765924c57e62a207b2b3" UNIQUE ("rfxItemId"), CONSTRAINT "PK_ea70c89055f97af9c340a5cf9ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_open_products_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'SELECTED', 'REJECTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_open_products" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxItemId" uuid NOT NULL, "catalogueSpecificationValues" jsonb NOT NULL, "catalogueImages" jsonb, "catalogueDeliveryValues" jsonb NOT NULL, "vendorId" uuid NOT NULL, "vendorMetadata" jsonb NOT NULL, "status" "public"."rfx_open_products_status_enum" NOT NULL DEFAULT 'DRAFT', CONSTRAINT "UQ_6bf25a233b30834101d52a34845" UNIQUE ("rfxItemId", "vendorId"), CONSTRAINT "PK_41043b84deb106f672decf6976d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_items_status_enum" AS ENUM('DRAFT', 'PENDING', 'INVITATION_PREPARED', 'SUBMITTED', 'COMPLETED', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "prId" character varying NOT NULL, "rfxId" uuid NOT NULL, "isOpen" boolean NOT NULL DEFAULT false, "itemCode" character varying NOT NULL, "itemType" character varying, "procurementCategory" character varying, "name" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "unitOfMeasure" character varying NOT NULL, "estimatedPrice" numeric(10,2) NOT NULL DEFAULT '0', "estimatedPriceCurrency" character varying NOT NULL, "marketPrice" numeric(10,2), "marketPriceCurrency" character varying, "metadata" jsonb, "status" "public"."rfx_items_status_enum" NOT NULL DEFAULT 'DRAFT', CONSTRAINT "PK_d3e9263fac21791f27e6a915f82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "PRRfxProcurementMechanisms" json, CONSTRAINT "REL_0d9b76eba711164360507bd58a" UNIQUE ("rfxId"), CONSTRAINT "PK_4d7fda03d9756544552438d4234" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_procurement_technical_teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "userId" character varying NOT NULL, "userName" character varying, "isTeamLead" boolean NOT NULL, CONSTRAINT "UQ_508b3bcf60467fd1e02211dd7b0" UNIQUE ("rfxId", "userId"), CONSTRAINT "PK_d362707284752e04833668f18d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_bid_procedures" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "bidValidityPeriod" integer NOT NULL, "submissionDeadline" character varying NOT NULL, "openingDate" character varying NOT NULL, "invitationDate" character varying, "deltaPercentage" integer NOT NULL, "isReverseAuction" boolean NOT NULL DEFAULT 'false', "round" integer NOT NULL DEFAULT '1', "minimumBidDecrementPercentage" integer, "roundDuration" integer, CONSTRAINT "REL_47d8e996a39917bf85802dea87" UNIQUE ("rfxId"), CONSTRAINT "CHK_3aa620f4161754d0a267ee9c5d" CHECK ("minimumBidDecrementPercentage" >= 0 AND "minimumBidDecrementPercentage" < 100), CONSTRAINT "CHK_fb18703f71b89c806e6872c91a" CHECK ("openingDate" > "submissionDeadline"), CONSTRAINT "PK_c27bb53fdd74adae3ad2983bc9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_bid_qualifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "criteria" character varying NOT NULL, "order" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_bc7efaaf14e2a55b4be68796278" UNIQUE ("rfxId", "order"), CONSTRAINT "UQ_7821504bb771b2ae5b0742bf0ee" UNIQUE ("rfxId", "criteria"), CONSTRAINT "PK_343e1cdb15a72aa2e01c3507ff1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_bid_contract_conditions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "deliveryPeriod" integer NOT NULL, "deliverySite" character varying NOT NULL, "warrantyPeriod" integer NOT NULL, "liquidityDamage" integer NOT NULL DEFAULT '0', "liquidityDamageLimit" integer NOT NULL, "paymentTerm" character varying NOT NULL, "paymentMode" text NOT NULL, "paymentReleasePeriod" integer NOT NULL, CONSTRAINT "REL_32c49aac47c4f33db07493ced2" UNIQUE ("rfxId"), CONSTRAINT "CHK_7353cc50107f0b8c14ba3f7f42" CHECK ("liquidityDamageLimit" >= 0 AND "liquidityDamageLimit" <= 100), CONSTRAINT "CHK_e0e9554979f696710923fe3890" CHECK ("liquidityDamage" >= 0 AND "liquidityDamage" <= 100), CONSTRAINT "CHK_858b331129286d9bf8cd3a7a12" CHECK ("deliveryPeriod" > 0), CONSTRAINT "PK_67e2bc6c5988644e68956012978" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_documentary_evidence" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "documentTitle" character varying NOT NULL, "required" boolean DEFAULT false, "order" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_3c5caa495cdb5e1af5d882250fb" UNIQUE ("rfxId", "order"), CONSTRAINT "UQ_69201d5b3d93c08df941d0fc243" UNIQUE ("rfxId", "documentTitle"), CONSTRAINT "PK_f154cd5b0ed87adab6db73cec41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_notes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "content" character varying NOT NULL, "key" character varying NOT NULL, "metadata" jsonb, "objectId" character varying NOT NULL, "objectType" character varying NOT NULL, CONSTRAINT "PK_e53f421b579a0ef7aecc473111a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_revision_approvals_status_enum" AS ENUM('APPROVED', 'ADJUST')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_revision_approvals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "userId" uuid NOT NULL, "status" "public"."rfx_revision_approvals_status_enum" NOT NULL DEFAULT 'APPROVED', CONSTRAINT "PK_0e4522493719035cdff87a5ae3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxs_status_enum" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfxs" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "procurementCategory" character varying, "procurementReferenceNumber" character varying, "budgetAmount" numeric(10,2) NOT NULL DEFAULT '0', "budgetAmountCurrency" character varying NOT NULL, "budgetCode" character varying NOT NULL, "prId" character varying NOT NULL, "status" "public"."rfxs_status_enum" NOT NULL DEFAULT 'DRAFT', "metadata" jsonb, "organizationId" character varying NOT NULL, "organizationName" character varying NOT NULL, "reviewDeadline" character varying, "parentId" uuid, CONSTRAINT "REL_db7d56313d90dbb04a5d22fbd9" UNIQUE ("parentId"), CONSTRAINT "PK_eab30e14df8f14e83d97ed8f9ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "fileInfo" jsonb NOT NULL, "itemId" character varying NOT NULL, "type" character varying NOT NULL, "version" integer NOT NULL, "key" character varying NOT NULL, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_technical_requirements" ADD CONSTRAINT "FK_39156c8f6764cc474148acc381d" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" ADD CONSTRAINT "FK_016c979bfbe040b2a96d708b5f1" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" ADD CONSTRAINT "FK_6fe75a765924c57e62a207b2b37" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_open_products" ADD CONSTRAINT "FK_6c3e3931d909b517b75abf83064" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "rfx_bid_qualifications" ADD CONSTRAINT "FK_5087e1716b7024134030fa12a77" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD CONSTRAINT "FK_32c49aac47c4f33db07493ced2a" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" ADD CONSTRAINT "FK_0a2ff1bee75a00c95fc546c4670" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_notes" ADD CONSTRAINT "FK_1fbc99bffe9a0bd9b58dd83eb12" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_revision_approvals" ADD CONSTRAINT "FK_87ecfc632e35405a06cc320b5d7" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ADD CONSTRAINT "FK_db7d56313d90dbb04a5d22fbd9e" FOREIGN KEY ("parentId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfxs" DROP CONSTRAINT "FK_db7d56313d90dbb04a5d22fbd9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_revision_approvals" DROP CONSTRAINT "FK_87ecfc632e35405a06cc320b5d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_notes" DROP CONSTRAINT "FK_1fbc99bffe9a0bd9b58dd83eb12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" DROP CONSTRAINT "FK_0a2ff1bee75a00c95fc546c4670"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" DROP CONSTRAINT "FK_32c49aac47c4f33db07493ced2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_qualifications" DROP CONSTRAINT "FK_5087e1716b7024134030fa12a77"`,
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
      `ALTER TABLE "rfx_open_products" DROP CONSTRAINT "FK_6c3e3931d909b517b75abf83064"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" DROP CONSTRAINT "FK_6fe75a765924c57e62a207b2b37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_invitations" DROP CONSTRAINT "FK_016c979bfbe040b2a96d708b5f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_technical_requirements" DROP CONSTRAINT "FK_39156c8f6764cc474148acc381d"`,
    );
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "rfxs"`);
    await queryRunner.query(`DROP TYPE "public"."rfxs_status_enum"`);
    await queryRunner.query(`DROP TABLE "rfx_revision_approvals"`);
    await queryRunner.query(
      `DROP TYPE "public"."rfx_revision_approvals_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "rfx_notes"`);
    await queryRunner.query(`DROP TABLE "rfx_documentary_evidence"`);
    await queryRunner.query(`DROP TABLE "rfx_bid_contract_conditions"`);
    await queryRunner.query(`DROP TABLE "rfx_bid_qualifications"`);
    await queryRunner.query(`DROP TABLE "rfx_bid_procedures"`);
    await queryRunner.query(`DROP TABLE "rfx_procurement_technical_teams"`);
    await queryRunner.query(`DROP TABLE "rfx_procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "rfx_items"`);
    await queryRunner.query(`DROP TYPE "public"."rfx_items_status_enum"`);
    await queryRunner.query(`DROP TABLE "rfx_open_products"`);
    await queryRunner.query(
      `DROP TYPE "public"."rfx_open_products_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "rfx_item_documents"`);
    await queryRunner.query(`DROP TABLE "rfx_bid_invitations"`);
    await queryRunner.query(
      `DROP TYPE "public"."rfx_bid_invitations_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "rfx_technical_requirements"`);
  }
}

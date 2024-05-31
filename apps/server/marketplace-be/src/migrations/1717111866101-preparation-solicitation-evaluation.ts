import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreparationSolicitationEvaluation1717111866101
  implements MigrationInterface
{
  name = 'PreparationSolicitationEvaluation1717111866101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rfx_technical_requirements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalSpecification" jsonb NOT NULL, "deliverySpecification" jsonb NOT NULL, "rfxItemId" uuid NOT NULL, CONSTRAINT "REL_39156c8f6764cc474148acc381" UNIQUE ("rfxItemId"), CONSTRAINT "PK_1a681fe5e0dd4c5436956b4f6f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "PRRfxProcurementMechanisms" json, CONSTRAINT "REL_0d9b76eba711164360507bd58a" UNIQUE ("rfxId"), CONSTRAINT "PK_4d7fda03d9756544552438d4234" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_procurement_technical_teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "userName" character varying, "isTeamLead" boolean NOT NULL, "rfxId" uuid NOT NULL, CONSTRAINT "UQ_508b3bcf60467fd1e02211dd7b0" UNIQUE ("rfxId", "userId"), CONSTRAINT "PK_d362707284752e04833668f18d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_bid_procedures" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidValidityPeriod" integer NOT NULL, "submissionDeadline" TIMESTAMP NOT NULL, "openingDate" TIMESTAMP NOT NULL, "invitationDate" TIMESTAMP, "reviewDeadline" TIMESTAMP, "deltaPercentage" integer NOT NULL, "isReverseAuction" boolean NOT NULL DEFAULT false, "round" integer NOT NULL DEFAULT '0', "minimumBidDecrementPercentage" integer, "roundDuration" integer, "idleTime" integer, "rfxId" uuid NOT NULL, CONSTRAINT "REL_47d8e996a39917bf85802dea87" UNIQUE ("rfxId"), CONSTRAINT "CHK_3aa620f4161754d0a267ee9c5d" CHECK ("minimumBidDecrementPercentage" >= 0 AND "minimumBidDecrementPercentage" < 100), CONSTRAINT "CHK_67e53717b3ef9d87cc22ecfdda" CHECK ("submissionDeadline" > CURRENT_TIMESTAMP), CONSTRAINT "CHK_fb18703f71b89c806e6872c91a" CHECK ("openingDate" > "submissionDeadline"), CONSTRAINT "PK_c27bb53fdd74adae3ad2983bc9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_bid_contract_conditions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "liquidityDamage" integer NOT NULL DEFAULT '0', "liquidityDamageLimit" integer NOT NULL, "isPartialAllowed" boolean NOT NULL DEFAULT false, "paymentReleasePeriod" integer NOT NULL, "rfxId" uuid NOT NULL, CONSTRAINT "REL_32c49aac47c4f33db07493ced2" UNIQUE ("rfxId"), CONSTRAINT "CHK_7353cc50107f0b8c14ba3f7f42" CHECK ("liquidityDamageLimit" >= 0 AND "liquidityDamageLimit" <= 100), CONSTRAINT "CHK_5fb0d69fead4acc56e5b872025" CHECK ("liquidityDamageLimit" >=  "liquidityDamage"), CONSTRAINT "PK_67e2bc6c5988644e68956012978" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_item_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileInfo" jsonb, "title" character varying, "key" character varying NOT NULL, "rfxItemId" uuid NOT NULL, CONSTRAINT "UQ_f4977b96688db2a9e9d3662fedf" UNIQUE ("rfxItemId", "key"), CONSTRAINT "REL_6fe75a765924c57e62a207b2b3" UNIQUE ("rfxItemId"), CONSTRAINT "PK_ea70c89055f97af9c340a5cf9ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "fileInfo" jsonb NOT NULL, "itemId" character varying NOT NULL, "type" character varying NOT NULL, "version" integer NOT NULL, "key" character varying NOT NULL, "userId" uuid, "organizationId" uuid, "organizationName" character varying, CONSTRAINT "UQ_c406abe52483ff1d1b9e8ea564c" UNIQUE ("key", "itemId", "version"), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_revision_approvals_status_enum" AS ENUM('APPROVED', 'ADJUST')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_revision_approvals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "status" "public"."rfx_revision_approvals_status_enum" NOT NULL DEFAULT 'APPROVED', "rfxId" uuid NOT NULL, "rfxProcurementTechnicalTeamId" uuid, CONSTRAINT "PK_0e4522493719035cdff87a5ae3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eval_assessments_qualified_enum" AS ENUM('COMPLY', 'NOT_COMPLY', 'NOT_APPLICABLE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "eval_assessments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isTeamAssessment" boolean NOT NULL DEFAULT false, "qualified" "public"."eval_assessments_qualified_enum" NOT NULL, "remark" character varying, "teamMemberId" uuid NOT NULL, "rfxId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_9a98b78b09bf576982d536f8148" UNIQUE ("teamMemberId", "rfxId", "isTeamAssessment", "solRegistrationId"), CONSTRAINT "PK_e932a1600a84ea11e2ba6bd9569" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_registrations_status_enum" AS ENUM('PENDING', 'REGISTERED', 'SUBMITTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_registrations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "vendorName" character varying NOT NULL, "salt" character varying NOT NULL, "response" character varying NOT NULL, "status" "public"."sol_registrations_status_enum" NOT NULL DEFAULT 'REGISTERED', "rfxId" uuid NOT NULL, CONSTRAINT "UQ_005b785bc54acad610fa48b8ecb" UNIQUE ("rfxId", "vendorId"), CONSTRAINT "PK_e12bba4fe56e35b5b23b819b421" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."opened_offers_status_enum" AS ENUM('PENDING', 'WINNER', 'NEXT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_offers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "price" integer NOT NULL, "status" "public"."opened_offers_status_enum" NOT NULL DEFAULT 'PENDING', "rfxItemId" uuid NOT NULL, "solOfferId" uuid NOT NULL, "solRoundId" uuid NOT NULL, "rfxProductInvitationId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_b3f7c350af861ad22f4775b70b7" UNIQUE ("rfxItemId", "vendorId", "solRoundId", "rfxProductInvitationId"), CONSTRAINT "REL_9678140a5fbfc9e80dd8ff2e54" UNIQUE ("solOfferId"), CONSTRAINT "PK_280297ae99aa7bcd003128e2295" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_rounds_status_enum" AS ENUM('PENDING', 'STARTED', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_rounds" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "round" integer NOT NULL, "start" TIMESTAMP NOT NULL, "end" TIMESTAMP NOT NULL, "startingPrice" numeric(10,2), "status" "public"."sol_rounds_status_enum" NOT NULL DEFAULT 'PENDING', "rfxId" uuid NOT NULL, CONSTRAINT "UQ_9bde8c18a8d72c14733a8a4e8f9" UNIQUE ("rfxId", "round"), CONSTRAINT "PK_4edc48d99d8d49fa0c1b905b1a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_offers_status_enum" AS ENUM('PENDING', 'WINNER', 'NEXT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_offers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "encryptedPrice" character varying NOT NULL, "status" "public"."sol_offers_status_enum" NOT NULL DEFAULT 'PENDING', "rfxItemId" uuid NOT NULL, "solRoundId" uuid NOT NULL, "rfxProductInvitationId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_72c95a6d8841255c602a87de08d" UNIQUE ("rfxItemId", "solRegistrationId", "solRoundId", "rfxProductInvitationId"), CONSTRAINT "PK_eda83e4ba056d3a22f6738f22ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eval_item_responses_qualified_enum" AS ENUM('COMPLY', 'NOT_COMPLY', 'NOT_APPLICABLE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "eval_item_responses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isTeamAssessment" boolean NOT NULL DEFAULT false, "qualified" "public"."eval_item_responses_qualified_enum" NOT NULL, "remark" character varying, "teamMemberId" uuid NOT NULL, "openedItemResponseId" uuid NOT NULL, "rfxProductInvitaitonId" uuid NOT NULL, "rfxItemId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_345355742b40f58f730609bbabd" UNIQUE ("teamMemberId", "rfxProductInvitaitonId", "isTeamAssessment"), CONSTRAINT "PK_7c3b0e61927330bda9c0fe3c70a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_response_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "key" character varying NOT NULL, "value" jsonb NOT NULL, "rfxItemId" uuid NOT NULL, "solItemResponseId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_ccc40594d56339a7b73f5dbba33" UNIQUE ("rfxItemId", "vendorId", "key"), CONSTRAINT "REL_e35d183419fde3a947576ea076" UNIQUE ("solItemResponseId"), CONSTRAINT "PK_7e7ac8d57e7f06cb13ba43bcce9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_response_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, "rfxItemId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_4e6ecd9184878cab667785e0b50" UNIQUE ("rfxItemId", "solRegistrationId", "key"), CONSTRAINT "PK_a6d8194a74ff1ea5751160f87b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "documentTitle" character varying NOT NULL, "description" character varying, "required" boolean NOT NULL DEFAULT true, "order" integer NOT NULL DEFAULT '1', "rfxId" uuid NOT NULL, CONSTRAINT "UQ_07b02a202becb52a6a57d1c60d5" UNIQUE ("rfxId", "order"), CONSTRAINT "UQ_f1215b104384d6a3b9286270608" UNIQUE ("rfxId", "documentTitle"), CONSTRAINT "PK_9de20cf2c20c1890ab3fa09dd80" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_responses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "value" jsonb NOT NULL, "rfxDocumentaryEvidenceId" uuid NOT NULL, "solResponseId" uuid NOT NULL, "rfxId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_f4f8326b3f0492bc85b5b8e5d36" UNIQUE ("rfxId", "vendorId", "rfxDocumentaryEvidenceId"), CONSTRAINT "REL_5ebc337f03b2a1194db7baf0cd" UNIQUE ("solResponseId"), CONSTRAINT "PK_72394c2f73f61730415667101f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_responses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "value" text NOT NULL, "rfxDocumentaryEvidenceId" uuid NOT NULL, "rfxId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_363d89f999858fbda80fc1471b2" UNIQUE ("rfxId", "solRegistrationId", "rfxDocumentaryEvidenceId"), CONSTRAINT "PK_b9d65d1234a013d20d1e51fbfe2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sol_bookmarks_status_enum" AS ENUM('BOOKMARKED', 'REGISTERED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sol_bookmarks" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "status" "public"."sol_bookmarks_status_enum" NOT NULL DEFAULT 'BOOKMARKED', "rfxId" uuid NOT NULL, CONSTRAINT "UQ_ed03986c98cdd20a9842224f3db" UNIQUE ("rfxId", "vendorId"), CONSTRAINT "PK_56f8d1f11df1961716d7fdc15bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_product_invitations_status_enum" AS ENUM('DRAFT', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ACCEPTED', 'DISCARDED', 'WITHDRAWN', 'COMPLY', 'NOT_COMPLY', 'ENDED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_product_invitations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productCatalogueId" character varying NOT NULL, "catalogueSpecificationValues" jsonb NOT NULL, "catalogueImages" jsonb, "catalogueDeliveryValues" jsonb NOT NULL, "vendorId" uuid NOT NULL, "vendorMetadata" jsonb NOT NULL, "status" "public"."rfx_product_invitations_status_enum" NOT NULL DEFAULT 'DRAFT', "rfxItemId" uuid NOT NULL, CONSTRAINT "PK_319efbebd810b94799306f7ddc4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_items_status_enum" AS ENUM('DRAFT', 'PENDING', 'INVITATION_PREPARED', 'SUBMITTED', 'APPROVED', 'COMPLETED', 'REJECTED', 'ENDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isOpen" boolean NOT NULL DEFAULT false, "itemCode" character varying NOT NULL, "itemType" character varying, "procurementCategory" character varying, "name" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "unitOfMeasure" character varying NOT NULL, "warrantyPeriod" integer, "estimatedPrice" numeric(10,2) NOT NULL DEFAULT '0', "estimatedPriceCurrency" character varying NOT NULL, "marketPrice" numeric(10,2), "marketPriceCurrency" character varying, "metadata" jsonb, "status" "public"."rfx_items_status_enum" NOT NULL DEFAULT 'DRAFT', "rfxId" uuid NOT NULL, CONSTRAINT "PK_d3e9263fac21791f27e6a915f82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ENDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfxes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "procurementCategory" character varying, "procurementReferenceNumber" character varying, "budgetAmount" numeric(14,2) NOT NULL DEFAULT '0', "budgetAmountCurrency" character varying NOT NULL, "budgetCode" character varying NOT NULL, "prId" character varying NOT NULL, "isOpen" boolean NOT NULL DEFAULT false, "status" "public"."rfxes_status_enum" NOT NULL DEFAULT 'DRAFT', "metadata" jsonb, "organizationId" character varying NOT NULL, "organizationName" character varying NOT NULL, "parentId" uuid, CONSTRAINT "REL_08a767682434c18de7d26f2436" UNIQUE ("parentId"), CONSTRAINT "PK_cf38233c1850b22a64697a53103" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eval_responses_qualified_enum" AS ENUM('COMPLY', 'NOT_COMPLY', 'NOT_APPLICABLE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "eval_responses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isTeamAssessment" boolean NOT NULL DEFAULT false, "qualified" "public"."eval_responses_qualified_enum" NOT NULL, "remark" character varying, "openedResponseId" uuid NOT NULL, "teamMemberId" uuid NOT NULL, "rfxId" uuid NOT NULL, "rfxDocumentaryEvidenceId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_883ac62c23b465b62126129a5c8" UNIQUE ("teamMemberId", "rfxId", "isTeamAssessment", "openedResponseId"), CONSTRAINT "PK_eb2b1f051a600d09a5882eb6570" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_members" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "personnelId" uuid NOT NULL, "personnelName" character varying NOT NULL, "isTeamLead" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "rfxId" uuid NOT NULL, CONSTRAINT "PK_ca3eae89dcf20c9fd95bf7460aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_technical_requirements" ADD CONSTRAINT "FK_39156c8f6764cc474148acc381d" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_procurement_mechanisms" ADD CONSTRAINT "FK_0d9b76eba711164360507bd58aa" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_procurement_technical_teams" ADD CONSTRAINT "FK_fe6817daee630f4a7fb188c25a7" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD CONSTRAINT "FK_47d8e996a39917bf85802dea870" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_contract_conditions" ADD CONSTRAINT "FK_32c49aac47c4f33db07493ced2a" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" ADD CONSTRAINT "FK_6fe75a765924c57e62a207b2b37" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_revision_approvals" ADD CONSTRAINT "FK_87ecfc632e35405a06cc320b5d7" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_revision_approvals" ADD CONSTRAINT "FK_535159ae1cce1502d568223a17a" FOREIGN KEY ("rfxProcurementTechnicalTeamId") REFERENCES "rfx_procurement_technical_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" ADD CONSTRAINT "FK_0c5755fc514cb4513b675a4d3b3" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" ADD CONSTRAINT "FK_5b12a455472faae7d138529571a" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" ADD CONSTRAINT "FK_81f2281803f41932c17823f02d9" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_registrations" ADD CONSTRAINT "FK_a187f85b4872f4b3be0e343cb30" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD CONSTRAINT "FK_054ec8fe170af7bd28c5403c020" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD CONSTRAINT "FK_9678140a5fbfc9e80dd8ff2e545" FOREIGN KEY ("solOfferId") REFERENCES "sol_offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD CONSTRAINT "FK_a363dc049ab5e91f689664a1bbc" FOREIGN KEY ("solRoundId") REFERENCES "sol_rounds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD CONSTRAINT "FK_9340c8eab9bdba29351e2b7c1f0" FOREIGN KEY ("rfxProductInvitationId") REFERENCES "rfx_product_invitations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD CONSTRAINT "FK_36b79cffcef782c8cb41f1ff353" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD CONSTRAINT "FK_92b6c44d655ae041fd7f30abc13" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "sol_offers" ADD CONSTRAINT "FK_2c8b36df6ca865e230fbc746c9b" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_b29c3a490e8523e158f6da6788e" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_57614f292ebb2958b30cdd265a5" FOREIGN KEY ("openedItemResponseId") REFERENCES "opened_response_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_42b0be36141c1fca48c16f2714a" FOREIGN KEY ("rfxProductInvitaitonId") REFERENCES "rfx_product_invitations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_1d7ec7af0526e3800b44c463993" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_7e88c439341b646bde388694b15" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" ADD CONSTRAINT "FK_f939ffd2c010af755fdc03238e7" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" ADD CONSTRAINT "FK_e35d183419fde3a947576ea0760" FOREIGN KEY ("solItemResponseId") REFERENCES "sol_response_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" ADD CONSTRAINT "FK_a1d66529e2f34ddcc4d6a3ca2da" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" ADD CONSTRAINT "FK_d9ef38ae9f0830e41ffaf83c8d3" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" ADD CONSTRAINT "FK_4aef63fad35f3f5692c680cc05a" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidences" ADD CONSTRAINT "FK_108ec833001fc39aad1d3234f45" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD CONSTRAINT "FK_35ebc892ffea1fb386251b8d4d9" FOREIGN KEY ("rfxDocumentaryEvidenceId") REFERENCES "rfx_documentary_evidences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD CONSTRAINT "FK_5ebc337f03b2a1194db7baf0cd5" FOREIGN KEY ("solResponseId") REFERENCES "sol_responses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD CONSTRAINT "FK_57c3860922e407a8a21fa6e761f" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD CONSTRAINT "FK_011a01ad28602c6c7b31c34ea3c" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD CONSTRAINT "FK_365396326b40948d08476949d57" FOREIGN KEY ("rfxDocumentaryEvidenceId") REFERENCES "rfx_documentary_evidences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD CONSTRAINT "FK_ed3f688667dc0d70998c22f3103" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD CONSTRAINT "FK_00f55c7f1bd5d3f863160f4c53e" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_bookmarks" ADD CONSTRAINT "FK_191ffb2c4d3f469513b4f09de6c" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ADD CONSTRAINT "FK_7ec684be7a43451201e2f38b128" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ADD CONSTRAINT "FK_e5a050d3845d0b970b667a419f6" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ADD CONSTRAINT "FK_08a767682434c18de7d26f2436f" FOREIGN KEY ("parentId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_bb6776c0ebce80533ccf9bd22d5" FOREIGN KEY ("rfxDocumentaryEvidenceId") REFERENCES "rfx_documentary_evidences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_36fcf8498f3ed637f36efaaeef7" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_549f9635a68512ffa189fcead71" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_406e761938ea6ba9ab61d3960d5" FOREIGN KEY ("openedResponseId") REFERENCES "opened_responses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_e245817f9741320e242822d91ed" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_5b7e581ef8f6b3eeda3b00fa2cf" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_5b7e581ef8f6b3eeda3b00fa2cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_e245817f9741320e242822d91ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_406e761938ea6ba9ab61d3960d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_549f9635a68512ffa189fcead71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_36fcf8498f3ed637f36efaaeef7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_bb6776c0ebce80533ccf9bd22d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" DROP CONSTRAINT "FK_08a767682434c18de7d26f2436f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" DROP CONSTRAINT "FK_e5a050d3845d0b970b667a419f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" DROP CONSTRAINT "FK_7ec684be7a43451201e2f38b128"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_bookmarks" DROP CONSTRAINT "FK_191ffb2c4d3f469513b4f09de6c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP CONSTRAINT "FK_00f55c7f1bd5d3f863160f4c53e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP CONSTRAINT "FK_ed3f688667dc0d70998c22f3103"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP CONSTRAINT "FK_365396326b40948d08476949d57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP CONSTRAINT "FK_011a01ad28602c6c7b31c34ea3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP CONSTRAINT "FK_57c3860922e407a8a21fa6e761f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP CONSTRAINT "FK_5ebc337f03b2a1194db7baf0cd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP CONSTRAINT "FK_35ebc892ffea1fb386251b8d4d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidences" DROP CONSTRAINT "FK_108ec833001fc39aad1d3234f45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" DROP CONSTRAINT "FK_4aef63fad35f3f5692c680cc05a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" DROP CONSTRAINT "FK_d9ef38ae9f0830e41ffaf83c8d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" DROP CONSTRAINT "FK_a1d66529e2f34ddcc4d6a3ca2da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" DROP CONSTRAINT "FK_e35d183419fde3a947576ea0760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" DROP CONSTRAINT "FK_f939ffd2c010af755fdc03238e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_7e88c439341b646bde388694b15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_1d7ec7af0526e3800b44c463993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_42b0be36141c1fca48c16f2714a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_57614f292ebb2958b30cdd265a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_b29c3a490e8523e158f6da6788e"`,
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
      `ALTER TABLE "sol_rounds" DROP CONSTRAINT "FK_92b6c44d655ae041fd7f30abc13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP CONSTRAINT "FK_36b79cffcef782c8cb41f1ff353"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP CONSTRAINT "FK_9340c8eab9bdba29351e2b7c1f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP CONSTRAINT "FK_a363dc049ab5e91f689664a1bbc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP CONSTRAINT "FK_9678140a5fbfc9e80dd8ff2e545"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP CONSTRAINT "FK_054ec8fe170af7bd28c5403c020"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_registrations" DROP CONSTRAINT "FK_a187f85b4872f4b3be0e343cb30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" DROP CONSTRAINT "FK_81f2281803f41932c17823f02d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" DROP CONSTRAINT "FK_5b12a455472faae7d138529571a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" DROP CONSTRAINT "FK_0c5755fc514cb4513b675a4d3b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_revision_approvals" DROP CONSTRAINT "FK_535159ae1cce1502d568223a17a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_revision_approvals" DROP CONSTRAINT "FK_87ecfc632e35405a06cc320b5d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" DROP CONSTRAINT "FK_6fe75a765924c57e62a207b2b37"`,
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
      `ALTER TABLE "rfx_technical_requirements" DROP CONSTRAINT "FK_39156c8f6764cc474148acc381d"`,
    );
    await queryRunner.query(`DROP TABLE "team_members"`);
    await queryRunner.query(`DROP TABLE "eval_responses"`);
    await queryRunner.query(
      `DROP TYPE "public"."eval_responses_qualified_enum"`,
    );
    await queryRunner.query(`DROP TABLE "rfxes"`);
    await queryRunner.query(`DROP TYPE "public"."rfxes_status_enum"`);
    await queryRunner.query(`DROP TABLE "rfx_items"`);
    await queryRunner.query(`DROP TYPE "public"."rfx_items_status_enum"`);
    await queryRunner.query(`DROP TABLE "rfx_product_invitations"`);
    await queryRunner.query(
      `DROP TYPE "public"."rfx_product_invitations_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "sol_bookmarks"`);
    await queryRunner.query(`DROP TYPE "public"."sol_bookmarks_status_enum"`);
    await queryRunner.query(`DROP TABLE "sol_responses"`);
    await queryRunner.query(`DROP TABLE "opened_responses"`);
    await queryRunner.query(`DROP TABLE "rfx_documentary_evidences"`);
    await queryRunner.query(`DROP TABLE "sol_response_items"`);
    await queryRunner.query(`DROP TABLE "opened_response_items"`);
    await queryRunner.query(`DROP TABLE "eval_item_responses"`);
    await queryRunner.query(
      `DROP TYPE "public"."eval_item_responses_qualified_enum"`,
    );
    await queryRunner.query(`DROP TABLE "sol_offers"`);
    await queryRunner.query(`DROP TYPE "public"."sol_offers_status_enum"`);
    await queryRunner.query(`DROP TABLE "sol_rounds"`);
    await queryRunner.query(`DROP TYPE "public"."sol_rounds_status_enum"`);
    await queryRunner.query(`DROP TABLE "opened_offers"`);
    await queryRunner.query(`DROP TYPE "public"."opened_offers_status_enum"`);
    await queryRunner.query(`DROP TABLE "sol_registrations"`);
    await queryRunner.query(
      `DROP TYPE "public"."sol_registrations_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "eval_assessments"`);
    await queryRunner.query(
      `DROP TYPE "public"."eval_assessments_qualified_enum"`,
    );
    await queryRunner.query(`DROP TABLE "rfx_revision_approvals"`);
    await queryRunner.query(
      `DROP TYPE "public"."rfx_revision_approvals_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "rfx_item_documents"`);
    await queryRunner.query(`DROP TABLE "rfx_bid_contract_conditions"`);
    await queryRunner.query(`DROP TABLE "rfx_bid_procedures"`);
    await queryRunner.query(`DROP TABLE "rfx_procurement_technical_teams"`);
    await queryRunner.query(`DROP TABLE "rfx_procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "rfx_technical_requirements"`);
  }
}

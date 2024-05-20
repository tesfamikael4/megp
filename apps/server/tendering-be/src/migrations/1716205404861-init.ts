import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1716205404861 implements MigrationInterface {
  name = 'Init1716205404861';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "procurement_technical_teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "userId" character varying NOT NULL, "userName" character varying, "isTeamLead" boolean NOT NULL, CONSTRAINT "PK_580667c2adc45b5f32acc7b4c77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "PRProcurementMechanisms" json NOT NULL, "invitationType" character varying, "marketApproach" character varying, "stageType" character varying, "stage" integer, CONSTRAINT "REL_3182144677e584be4c8019c9f7" UNIQUE ("tenderId"), CONSTRAINT "PK_8685ab6b89ae9fe4d5319ab84ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_response_tenders_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_response_tenders" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationId" uuid NOT NULL, "documentType" "public"."bid_response_tenders_documenttype_enum" NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_6888c9fd30987aa3249fb9c08c1" UNIQUE ("bidRegistrationId", "key"), CONSTRAINT "PK_fd5bb5d22f75d1c67e00c0baffe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."shared_bidder_keys_envelopetype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "shared_bidder_keys" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationId" uuid NOT NULL, "envelopeType" "public"."shared_bidder_keys_envelopetype_enum" NOT NULL, "privateKey" character varying NOT NULL, "contactName" character varying, "contactPhoneNumber" character varying, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "UQ_436cc2315ddd13e6ac2c2f46347" UNIQUE ("bidRegistrationId", "envelopeType"), CONSTRAINT "PK_7238236a51e65ea6f7155260843" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."opened_bid_response_tenders_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_bid_response_tenders" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationId" uuid NOT NULL, "documentType" "public"."opened_bid_response_tenders_documenttype_enum" NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_1b075bd20b690d2f3c970a5a0b2" UNIQUE ("bidRegistrationId", "key"), CONSTRAINT "PK_7295e696b7d02b913d6977fa050" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_registrations_enveloptype_enum" AS ENUM('single envelop', 'two envelop')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_registrations_status_enum" AS ENUM('PENDING', 'REGISTERED', 'SUBMITTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_registrations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "bidderId" character varying NOT NULL, "bidderName" character varying NOT NULL, "bidderRegistrationNo" character varying, "paymentInvoice" character varying, "paymentMethod" character varying, "payment" jsonb, "amount" numeric(10,2), "currency" character varying, "financialResponse" text, "technicalResponse" text, "response" text, "salt" character varying NOT NULL, "envelopType" "public"."bid_registrations_enveloptype_enum" NOT NULL, "status" "public"."bid_registrations_status_enum" NOT NULL DEFAULT 'REGISTERED', CONSTRAINT "UQ_e6cf61c5edd3e8f14a93cbde6df" UNIQUE ("tenderId", "bidderId"), CONSTRAINT "PK_4ca0a2601f3b183fbe38890ae34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_response_lots_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_response_lots" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "documentType" "public"."bid_response_lots_documenttype_enum" NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_f0eb2239cb7eff8c3d59c9e290b" UNIQUE ("bidRegistrationDetailId", "key"), CONSTRAINT "PK_244f44e3ff1d46dd602a4414e54" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_response_items_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_response_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "itemId" uuid NOT NULL, "documentType" "public"."bid_response_items_documenttype_enum" NOT NULL, "key" character varying NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_179ecb883c96b08336a8c2bb0c6" UNIQUE ("bidRegistrationDetailId", "itemId", "key"), CONSTRAINT "PK_1532d6ee1441ee9f3547ef73923" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."opened_bid_response_items_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_bid_response_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "itemId" uuid NOT NULL, "documentType" "public"."opened_bid_response_items_documenttype_enum" NOT NULL, "key" character varying NOT NULL, "value" jsonb NOT NULL, CONSTRAINT "UQ_4c077a7af2bcae73aceff73b495" UNIQUE ("bidRegistrationDetailId", "itemId", "key"), CONSTRAINT "PK_53c325b09c33bd06cf9b0300b89" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."opened_bid_response_lots_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_bid_response_lots" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "documentType" "public"."opened_bid_response_lots_documenttype_enum" NOT NULL, "key" character varying NOT NULL, "value" jsonb NOT NULL, CONSTRAINT "UQ_d067cfd6da1a57dbd53c691ed73" UNIQUE ("bidRegistrationDetailId", "key"), CONSTRAINT "PK_c6a10364817aac508ca1bae501b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_preliminary_assessment_details_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_preliminary_assessment_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalPreliminaryAssessmentId" uuid NOT NULL, "eqcPreliminaryExaminationId" uuid NOT NULL, "qualified" "public"."technical_preliminary_assessment_details_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "remark" character varying, CONSTRAINT "PK_b9042079141d0d29c652ddbf906" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_preliminary_assessments_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_preliminary_assessments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "evaluatorName" character varying NOT NULL, "isTeamAssessment" boolean NOT NULL DEFAULT false, "qualified" "public"."technical_preliminary_assessments_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "submit" boolean NOT NULL, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_f0c5eedfdadc5412b4f80703020" UNIQUE ("bidRegistrationDetailId", "isTeamAssessment", "evaluatorId"), CONSTRAINT "PK_ad760a22008750ed3fd6d1bcb73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bidders_comparisons_milestonenum_enum" AS ENUM('100', '102', '104', '106', '108', '110', '112', '200', '201', '202', '203', '204', '205', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '340', '360', '361', '362', '400', '401', '402', '500', '503', '505', '507', '600', '609', '612', '615', '9999', '9901')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bidders_comparisons_milestonetxt_enum" AS ENUM('Initiation', 'Configuration', 'Preparation', 'Revision', 'Submission', 'Approval', 'Publication', 'Solicitation', 'ClarificationRequest', 'ClarificationResponse', 'SiteVisit', 'BidderConference', 'Amendment', 'TenderInvitationClosing', 'Evaluation', 'TechnicalOpening', 'TechnicalOnlyOpening', 'TechnicalCompliance', 'TechnicalQualification', 'TechnicalResponsiveness', 'TechnicalScoring', 'TechnicalEndorsement', 'TechnicalStandstill', 'TechnicalPreEndorsement', 'FinancialOpening', 'FinancialOnlyOpening', 'FinancialCompliance', 'FinancialBidPriceValuation', 'FinancialQualification', 'FinancialScoring', 'PriceAnalysis', 'PostQualification', 'CombinationAssessment', 'FinalEndorsement', 'FinalStandstill', 'FinalPreEndorsement', 'Awarding', 'AwardNegotiation', 'PartialAwarding', 'Contracting', 'ContractSigning', 'LetterOfCreditOpening', 'Mobilization', 'Implementing', 'InspectionAndAcceptance', 'FinalAcceptance', 'ContractClosure', 'Unknown', 'Closing', '100', '102', '104', '106', '108', '110', '112', '200', '201', '202', '203', '204', '205', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '340', '360', '361', '362', '400', '401', '402', '500', '503', '505', '507', '600', '609', '612', '615', '9999', '9901')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bidders_comparisons_bidderstatus_enum" AS ENUM('200', '201', '202', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '400', '401', '501', '601', '900', '999')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bidders_comparisons_bidderstatustxt_enum" AS ENUM('Registered', 'Submitted', 'Withdrawn', 'TechnicalOpeningFailed', 'TechnicalOpeningSucceeded', 'TechnicalComplianceFailed', 'TechnicalComplianceSucceeded', 'TechnicalQualificationFailed', 'TechnicalQualificationSucceeded', 'TechnicalResponsivenessFailed', 'TechnicalResponsivenessSucceeded', 'TechnicalScoringFailed', 'TechnicalScoringSucceeded', 'TechnicalEvaluationFailed', 'TechnicalEvaluationSucceeded', 'FinancialOpeningFailed', 'FinancialOpeningSucceeded', 'FinancialComplianceFailed', 'FinancialComplianceSucceeded', 'FinancialQualificationFailed', 'FinancialQualificationSucceeded', 'FinancialResponsivenessFailed', 'FinancialResponsivenessSucceeded', 'FinancialScoringFailed', 'FinancialScoringSucceeded', 'FinancialEvaluationFailed', 'FinancialEvaluationSucceeded', 'FinancialBidPriceValuationFailed', 'FinancialBidPriceValuationSucceeded', 'PriceAnalysisSucceeded', 'PriceAnalysisFailed', 'PostQualificationSucceeded', 'PostQualificationFailed', 'AwardNegotiationSucceeded', 'AwardNegotiationFailed', 'CombinationEvaluationFailed', 'CombinationEvaluationSucceeded', 'AwardingFailed', 'AwardingSucceeded', 'Contracting', 'Implementation', 'Closed', 'Cancelled', '200', '201', '202', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '400', '401', '501', '601', '900', '999')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bidders_comparisons" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "itemId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "milestoneNum" "public"."bidders_comparisons_milestonenum_enum" NOT NULL, "milestoneTxt" "public"."bidders_comparisons_milestonetxt_enum" NOT NULL, "bidderStatus" "public"."bidders_comparisons_bidderstatus_enum" NOT NULL, "bidderStatusTxt" "public"."bidders_comparisons_bidderstatustxt_enum" NOT NULL, "technicalPoints" integer NOT NULL DEFAULT '0', "financialPoints" integer NOT NULL DEFAULT '0', "isCurrent" boolean NOT NULL DEFAULT true, "passFail" boolean NOT NULL, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_0c1da12cd4af778adc5174ba456" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_technical_scoring" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "parentId" uuid, "requirement" character varying NOT NULL, "formLink" character varying NOT NULL, "isProfessional" boolean NOT NULL, "validation" jsonb NOT NULL, CONSTRAINT "PK_94c7ee37dd96288ad502ea3e8cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_preference_margins" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "condition" character varying NOT NULL, "description" character varying NOT NULL, "margin" character varying NOT NULL, "itbReference" character varying NOT NULL, "itbDescription" text, CONSTRAINT "PK_b1cea0ea1235afb0b77cb29aaa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_preliminary_evaluations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "criteria" character varying NOT NULL, "type" character varying NOT NULL, "formLink" character varying NOT NULL, "itbReference" character varying NOT NULL, "itbDescription" text, CONSTRAINT "PK_c1e559d384a059e670b0adf7bce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_professional_settings" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "requirement" character varying NOT NULL, "formLink" character varying NOT NULL, "validation" jsonb NOT NULL, CONSTRAINT "PK_893158452f6aaab98a63fa15ecd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_qualifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "factor" character varying NOT NULL, "requirement" character varying NOT NULL, "formLink" character varying NOT NULL, "itbReference" character varying NOT NULL, "itbDescription" text, CONSTRAINT "PK_d512ad5a2d5f6a790a5a5e793d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_templates" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "documentDocx" jsonb, "documentPdf" jsonb, "spdId" uuid NOT NULL, CONSTRAINT "PK_e2d7118c5872d3f54f78ab3609a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_response_documents_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_response_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "bidFormId" uuid NOT NULL, "documentType" "public"."bid_response_documents_documenttype_enum" NOT NULL, "value" text NOT NULL, "pdfValue" text, CONSTRAINT "UQ_5d08807184d0486bf5cc5d0e360" UNIQUE ("bidRegistrationDetailId", "bidFormId"), CONSTRAINT "PK_ed41818561fd49fcb75fd2b1745" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_bid_forms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "code" character varying NOT NULL, "type" character varying NOT NULL, "documentDocx" jsonb, "documentPdf" jsonb, "spdId" uuid NOT NULL, CONSTRAINT "PK_fcb204245fba67ea286ed89be61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_contract_forms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "code" character varying NOT NULL, "type" character varying NOT NULL, "documentDocx" jsonb, "documentPdf" jsonb, "spdId" uuid NOT NULL, CONSTRAINT "PK_92b8362bdbed79660313dd9c642" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_spds" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "spdId" uuid NOT NULL, "bds" jsonb, "scc" jsonb, CONSTRAINT "REL_0d09038a7c2856a68c38b8a9ff" UNIQUE ("tenderId"), CONSTRAINT "PK_2301fcddf238ba9c4916d39b1de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "checkOnFirstCompliance" boolean NOT NULL, "checkOnFirstOpening" boolean NOT NULL, "checkOnSecondCompliance" boolean NOT NULL, "checkOnSecondOpening" boolean NOT NULL, "evidenceTitle" character varying NOT NULL, "evidenceType" character varying NOT NULL, CONSTRAINT "PK_b717c9ee36bfa062c4ffb923a38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "governingRule" jsonb, "name" character varying NOT NULL, "description" character varying NOT NULL, "marketType" character varying NOT NULL, "procurementCategory" character varying NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_c048f166470e0a788481a2a744c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_opening_checklists" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "name" character varying NOT NULL, "isBoolean" boolean NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_3b76ae674bd35534bade3cd3971" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_opening_checklists" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "lotId" uuid NOT NULL, "spdOpeningChecklistId" uuid NOT NULL, "bidRegistrationDetailId" uuid NOT NULL, "bidderId" uuid NOT NULL, "bidderName" character varying NOT NULL, "openerId" uuid NOT NULL, "openerName" character varying NOT NULL, "isTeamLead" boolean NOT NULL DEFAULT false, "checked" boolean NOT NULL, "remark" character varying, "complete" boolean NOT NULL DEFAULT false, "submit" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_277eec427ddffe68714c293e7f7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_qualifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "factor" character varying NOT NULL, "requirement" character varying NOT NULL, "category" character varying NOT NULL, "singleEntityCondition" jsonb NOT NULL, "jvEachPartnerCondition" jsonb NOT NULL, "jvCombinedPartnerCondition" jsonb NOT NULL, "jvAtleastOnePartnerCondition" jsonb NOT NULL, "order" integer NOT NULL, "formLink" character varying NOT NULL, "itbDescription" character varying, "itbReference" character varying NOT NULL, "isRequired" boolean NOT NULL, "spdQualificationId" uuid, CONSTRAINT "PK_388eb2d21f4348e91352b603d4d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_qualification_assessment_detail_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_qualification_assessment_detail" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalQualificationAssessmentId" uuid NOT NULL, "eqcQualificationId" uuid NOT NULL, "qualified" "public"."technical_qualification_assessment_detail_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "remark" character varying, CONSTRAINT "PK_2d82b8657a27632fbe0c0272d90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_qualification_assessments_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_qualification_assessments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "evaluatorName" character varying NOT NULL, "isTeamAssessment" boolean NOT NULL DEFAULT false, "qualified" "public"."technical_qualification_assessments_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "submit" boolean NOT NULL, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_150e11a9e6fb9616e0ea7aeb0c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_registration_details_status_enum" AS ENUM('NOT_SUBMITTED', 'SUBMITTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_registration_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationId" uuid NOT NULL, "lotId" uuid NOT NULL, "status" "public"."bid_registration_details_status_enum" NOT NULL DEFAULT 'NOT_SUBMITTED', "technicalItems" text, "financialItems" text, "document" jsonb, CONSTRAINT "UQ_e8f0046094e3a07232d14c853ab" UNIQUE ("bidRegistrationId", "lotId"), CONSTRAINT "PK_4d167389b3f45777e23b17a6a77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_responsiveness_assessments_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_responsiveness_assessments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "evaluatorName" character varying NOT NULL, "isTeamAssessment" boolean NOT NULL DEFAULT false, "qualified" "public"."technical_responsiveness_assessments_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "submit" boolean NOT NULL, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_e1d85ee8f32fad802377ebe2590" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_responsiveness_assessment_detail_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_responsiveness_assessment_detail" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalResponsivenessAssessmentId" uuid NOT NULL, "spdResponsivenessId" uuid NOT NULL, "qualified" "public"."technical_responsiveness_assessment_detail_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "remark" character varying, "sorTechnicalRequirementId" uuid, CONSTRAINT "PK_52f12b716d98e3bc5b5e8342e3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_technical_requirements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "sorType" character varying NOT NULL, "category" character varying NOT NULL, "requirement" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "requirementType" character varying NOT NULL, "formLink" character varying NOT NULL, CONSTRAINT "PK_498fa212fe8dc80a6107e96f546" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_reimburseable_expenses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "unitCost" integer NOT NULL, "cost" integer NOT NULL, CONSTRAINT "PK_86094dcad0a193cb9c804595397" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_bill_of_materials" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "payItem" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer, "amount" integer, "code" character varying NOT NULL, "parentCode" character varying, CONSTRAINT "PK_b872c04b57d2922919011de135c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_equipments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer, "amount" integer, CONSTRAINT "PK_5889e95b0ac6069f9d5c7f5262f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_fees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "category" character varying NOT NULL, "position" character varying NOT NULL, "nameOfStaff" character varying NOT NULL, "staffMonthRate" integer, "inputStaffMonth" integer NOT NULL, "rate" integer, CONSTRAINT "PK_6b9d5be14d3e030748fad6a07f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_incidental_costs" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "country" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer, "amount" integer, "currency" character varying, CONSTRAINT "PK_96e7cf682c0cd2b1612aef4eb7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_labors" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer, "amount" integer, CONSTRAINT "PK_90dbcc809c576b65ef2ac80a37d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "description" character varying NOT NULL, "attachment" jsonb NOT NULL, CONSTRAINT "PK_75b13abd98099f9a05a2c2063a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "itemCode" character varying NOT NULL, "procurementCategory" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "unitOfMeasure" character varying NOT NULL, "estimatedPrice" numeric(10,2) NOT NULL DEFAULT '0', "estimatedPriceCurrency" character varying NOT NULL, "marketPrice" numeric(10,2), "marketPriceCurrency" character varying, "hasBom" boolean NOT NULL, "metaData" jsonb, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_classifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "classification" jsonb NOT NULL, CONSTRAINT "PK_5c8e095ea8c8516a4370da8ea44" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_participation_fees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "amount" numeric(14,2) NOT NULL, "currency" character varying NOT NULL, "method" character varying NOT NULL, CONSTRAINT "REL_bb8523ce3a8e3441e0642278dd" UNIQUE ("tenderId"), CONSTRAINT "PK_29d8df4b5e1ccddf8203816d302" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_personals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "position" character varying NOT NULL, "evaluated" boolean NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_d1a8a37d20b6130a8583bdf6825" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bds_submissions_enveloptype_enum" AS ENUM('single envelop', 'two envelop')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_submissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "submissionDeadline" TIMESTAMP NOT NULL, "openingDate" TIMESTAMP NOT NULL, "invitationDate" TIMESTAMP NOT NULL, "envelopType" "public"."bds_submissions_enveloptype_enum" NOT NULL, CONSTRAINT "REL_f4643c48139c99ed56b357ed5e" UNIQUE ("tenderId"), CONSTRAINT "PK_b5b417bdfc6f5fa01996a6c4c09" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_response_documentary_evidences_documenttype_enum" AS ENUM('RESPONSE', 'TECHNICAL_RESPONSE', 'FINANCIAL_RESPONSE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_response_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "eqcDocumentaryEvidenceId" uuid NOT NULL, "documentType" "public"."bid_response_documentary_evidences_documenttype_enum" NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_cd34c2caacca5a167299df21bd7" UNIQUE ("bidRegistrationDetailId", "eqcDocumentaryEvidenceId"), CONSTRAINT "PK_de6438ada062ef318599bec324d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "checkOnFirstCompliance" boolean NOT NULL, "checkOnFirstOpening" boolean NOT NULL, "checkOnSecondCompliance" boolean NOT NULL, "checkOnSecondOpening" boolean NOT NULL, "evidenceTitle" character varying NOT NULL, "evidenceType" character varying NOT NULL, "spdDocumentaryEvidenceId" uuid, CONSTRAINT "PK_41690111cede6e13a16fb9a2d82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_due_diligences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "requirement" character varying, "requirementCondition" character varying NOT NULL, CONSTRAINT "PK_9c693e4122a4543955808d94c99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_preference_margins" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "name" character varying, "condition" character varying NOT NULL, "margin" integer NOT NULL, CONSTRAINT "PK_8f0740d0fb0e9c99e980bf20039" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_technical_scorings" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "parentId" uuid, "requirement" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "point" integer NOT NULL, "formLink" character varying NOT NULL, "spdTechnicalScoringId" uuid, "spdTechnicalScoringParentId" uuid, "isProfessional" boolean NOT NULL, "hasProfessional" boolean NOT NULL, "validation" jsonb NOT NULL, "isRequired" boolean NOT NULL, CONSTRAINT "PK_b77fd2261dfcadd1bf7b7ce220b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_generals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "jointVentureAllowed" boolean NOT NULL, "maximumNumberOfMembers" integer NOT NULL, "subContractAllowed" boolean NOT NULL, "maximumPercentageContractingAllowed" numeric(14,2) NOT NULL DEFAULT '0', "clarificationDeadline" TIMESTAMP NOT NULL, "preBidConferenceRequired" boolean NOT NULL, "preBidConferenceDate" TIMESTAMP NOT NULL, "siteVisitAllowed" boolean NOT NULL, CONSTRAINT "REL_a9b475d7e1baf128ac85bd5990" UNIQUE ("tenderId"), CONSTRAINT "PK_d6e0368edc816d219b1e649b4af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_awards" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "percentageQuantityIncreased" integer NOT NULL, "percentageQuantityDecreased" integer NOT NULL, "negotiationAllowed" boolean NOT NULL, CONSTRAINT "REL_360a587c5c63482a136ec4a93d" UNIQUE ("tenderId"), CONSTRAINT "PK_d562f5d119de65df4b18dd8f855" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bds_evaluations_evaluationmethod_enum" AS ENUM('point system', 'compliance')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bds_evaluations_selectionmethod_enum" AS ENUM('lowest price', 'highest price')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bds_evaluations_awardtype_enum" AS ENUM('item based', 'lot based')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_evaluations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "bidEvaluationCurrency" text NOT NULL, "evaluationMethod" "public"."bds_evaluations_evaluationmethod_enum" NOT NULL, "selectionMethod" "public"."bds_evaluations_selectionmethod_enum" NOT NULL, "awardType" "public"."bds_evaluations_awardtype_enum" NOT NULL, "technicalWeight" integer NOT NULL, "financialWeight" integer NOT NULL, "passingMark" integer NOT NULL, CONSTRAINT "REL_32110ff8c972bd861c32fdacb2" UNIQUE ("tenderId"), CONSTRAINT "PK_081f71b1010b0e8d30c8113264a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_preparations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "currencyOfTheBidForNationalBidders" jsonb NOT NULL, "currencyOfTheBidForInternationalBidders" jsonb NOT NULL, "incotermsEdition" character varying NOT NULL, "incotermType" character varying NOT NULL, "bidValidityPeriod" integer NOT NULL, CONSTRAINT "REL_19798e60cc425f76fd8c92ef7b" UNIQUE ("tenderId"), CONSTRAINT "PK_065f63f73ee399a52aa77aae961" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_bid_securities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "bidSecurityRequired" boolean NOT NULL, "bidSecurityAmount" integer, "bidSecurityCurrency" character varying, "bidSecurityForm" character varying NOT NULL, CONSTRAINT "REL_f74f982a3d5a91345ea8fd9686" UNIQUE ("lotId"), CONSTRAINT "PK_8fd567a4860c3c7311ada52bc4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_contract_deliverables" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "deliverable" text array NOT NULL, "deliverySchedule" integer NOT NULL, CONSTRAINT "PK_c0c61be27116a78e58e54138d00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_general_provisions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "contractDuration" integer NOT NULL, "commencementDay" integer NOT NULL DEFAULT '1', "deliverySite" character varying NOT NULL, CONSTRAINT "PK_4d9aa7f75432040d2aa083c39ae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_guarantees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "guaranteeType" character varying NOT NULL, "guaranteeRequired" boolean NOT NULL, "guaranteePercentage" integer NOT NULL, "currency" character varying(4) NOT NULL, "guaranteeForm" text array NOT NULL, "validityPeriod" integer NOT NULL, CONSTRAINT "PK_6cb526b18cfc761febc0951c5b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_liabilities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "warrantyPeriod" integer, "postWarrantyServicePeriod" integer, "liquidityDamage" integer NOT NULL DEFAULT '0', "liquidityDamageLimit" integer NOT NULL, CONSTRAINT "PK_001f88b8d869d57ab263d3b8cac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_payment_schedules" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "paymentSchedule" character varying NOT NULL, "paymentPercentage" integer NOT NULL, "order" integer NOT NULL, "requiredDocuments" text array NOT NULL, CONSTRAINT "PK_e5c64a4a278245ee8e09747ce21" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_payment_terms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "contractCurrency" text array NOT NULL, "paymentMode" text array NOT NULL, "advancePaymentAllowed" boolean NOT NULL DEFAULT true, "advancePaymentLimit" integer NOT NULL DEFAULT '0', "paymentReleasePeriod" integer NOT NULL, "latePaymentPenalty" integer NOT NULL, CONSTRAINT "PK_b561cbab1bef32331a72d820e86" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "content" character varying NOT NULL, "key" character varying NOT NULL, "metadata" jsonb, "objectId" character varying NOT NULL, "objectType" character varying NOT NULL, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."revision_approvals_status_enum" AS ENUM('APPROVED', 'APPROVED_WITH_COMMENT', 'ADJUST_WITH_COMMENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "revision_approvals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "userId" uuid NOT NULL, "status" "public"."revision_approvals_status_enum" NOT NULL DEFAULT 'APPROVED', CONSTRAINT "PK_5062ab2aef8191d1cc7484580b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_opening_minutes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "remark" character varying, CONSTRAINT "PK_1ad73acb4a86c5d6582a79b8097" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_members" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid NOT NULL, "personnelId" uuid NOT NULL, "personnelName" character varying NOT NULL, "isTeamLead" boolean NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_ca3eae89dcf20c9fd95bf7460aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."teams_envelopetype_enum" AS ENUM('single envelop', 'two envelop')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."teams_teamtype_enum" AS ENUM('TECHNICAL_OPENER', 'TECHNICAL_EVALUATOR', 'FINANCIAL_OPENER', 'FINANCIAL_EVALUATOR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid, "tenderId" uuid NOT NULL, "envelopeType" "public"."teams_envelopetype_enum" NOT NULL, "teamType" "public"."teams_teamtype_enum" NOT NULL, CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0" UNIQUE ("lotId", "teamType"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."openings_status_enum" AS ENUM('PENDING', 'COMPLETED', 'CANCELED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "openings" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "teamId" uuid NOT NULL, "openingType" character varying NOT NULL, "status" "public"."openings_status_enum" NOT NULL DEFAULT 'PENDING', "isReportReady" boolean NOT NULL DEFAULT false, CONSTRAINT "REL_898061552c1476d5a0a8cc6598" UNIQUE ("tenderId"), CONSTRAINT "REL_2134bf9ff08b1d831c9941ccc1" UNIQUE ("teamId"), CONSTRAINT "PK_52465524569a0b0e856a64eb48b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantee_extensions_status_enum" AS ENUM('INITIATED', 'REQUESTED', 'REVIEWED', 'VERIFIED', 'APPROVED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_guarantee_extensions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guaranteeId" uuid NOT NULL, "reason" character varying NOT NULL, "remark" character varying, "noOfDays" integer NOT NULL, "status" "public"."bid_guarantee_extensions_status_enum" NOT NULL, CONSTRAINT "PK_1e60d22f03fb4e4930eda4d0871" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantee_forfeits_status_enum" AS ENUM('REQUESTED', 'REVIEWED', 'VERIFIED', 'APPROVED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_guarantee_forfeits" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guaranteeId" uuid NOT NULL, "reason" character varying NOT NULL, "remark" character varying, "status" "public"."bid_guarantee_forfeits_status_enum" NOT NULL, CONSTRAINT "PK_7108ba76922644ecc7f521f974c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantee_releases_status_enum" AS ENUM('REQUESTED', 'RELEASED', 'AUTO_RELEASED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_guarantee_releases" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guaranteeId" uuid NOT NULL, "reason" character varying NOT NULL, "remark" character varying, "status" "public"."bid_guarantee_releases_status_enum" NOT NULL, CONSTRAINT "PK_673ce221bda99c9076442d1492f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantee_cancellations_status_enum" AS ENUM('REQUESTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_guarantee_cancellations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guaranteeId" uuid NOT NULL, "reason" character varying NOT NULL, "remark" character varying, "status" "public"."bid_guarantee_cancellations_status_enum" NOT NULL, CONSTRAINT "PK_5075161d83c75f39eb15a1d9be4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantees_status_enum" AS ENUM('DRAFT', 'REQUESTED', 'REVIEWED', 'REJECTED', 'VERIFIED', 'APPROVED', 'CANCELLED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_guarantees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidderId" uuid NOT NULL, "bidderName" character varying NOT NULL, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "lotId" uuid NOT NULL, "minValidityDate" integer, "revisedValidityDate" integer, "description" character varying NOT NULL, "contactPerson" jsonb NOT NULL, "hashValue" character varying, "amount" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "guarantorId" uuid NOT NULL, "guarantorName" character varying NOT NULL, "guarantorBranchId" uuid NOT NULL, "guarantorBranchName" character varying NOT NULL, "document" jsonb, "guaranteeReference" character varying, "referenceNumber" character varying, "status" "public"."bid_guarantees_status_enum" NOT NULL, CONSTRAINT "PK_c401506f883f8405a25e85a4b29" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_bookmarks_status_enum" AS ENUM('BOOKMARKED', 'REGISTERED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_bookmarks" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "bidderId" character varying NOT NULL, "bidderName" character varying NOT NULL, "status" "public"."bid_bookmarks_status_enum" NOT NULL DEFAULT 'BOOKMARKED', CONSTRAINT "UQ_da0d38e0dc6b4e7fc1538bb8f09" UNIQUE ("tenderId", "bidderId"), CONSTRAINT "PK_3235b03e8604ec822fd33114843" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_preliminary_examinations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "criteria" character varying NOT NULL, "order" integer NOT NULL, "itbDescription" character varying, "itbReference" character varying NOT NULL, "isRequired" boolean NOT NULL, "requirementCondition" character varying NOT NULL, "type" character varying NOT NULL, "formLink" character varying NOT NULL, "spdEqcPreliminaryExaminationId" uuid, CONSTRAINT "PK_5ef92ca75ba18d713bde11530eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "milestones_trackers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "milestoneType" text NOT NULL, "actualStartDate" TIMESTAMP, "actualEndDate" TIMESTAMP, "timeStamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_f24c9f1797cfd09afb32dd1501d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tender_milestones_milestonenum_enum" AS ENUM('100', '102', '104', '106', '108', '110', '112', '200', '201', '202', '203', '204', '205', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '340', '360', '361', '362', '400', '401', '402', '500', '503', '505', '507', '600', '609', '612', '615', '9999', '9901')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tender_milestones_milestonetxt_enum" AS ENUM('Initiation', 'Configuration', 'Preparation', 'Revision', 'Submission', 'Approval', 'Publication', 'Solicitation', 'ClarificationRequest', 'ClarificationResponse', 'SiteVisit', 'BidderConference', 'Amendment', 'TenderInvitationClosing', 'Evaluation', 'TechnicalOpening', 'TechnicalOnlyOpening', 'TechnicalCompliance', 'TechnicalQualification', 'TechnicalResponsiveness', 'TechnicalScoring', 'TechnicalEndorsement', 'TechnicalStandstill', 'TechnicalPreEndorsement', 'FinancialOpening', 'FinancialOnlyOpening', 'FinancialCompliance', 'FinancialBidPriceValuation', 'FinancialQualification', 'FinancialScoring', 'PriceAnalysis', 'PostQualification', 'CombinationAssessment', 'FinalEndorsement', 'FinalStandstill', 'FinalPreEndorsement', 'Awarding', 'AwardNegotiation', 'PartialAwarding', 'Contracting', 'ContractSigning', 'LetterOfCreditOpening', 'Mobilization', 'Implementing', 'InspectionAndAcceptance', 'FinalAcceptance', 'ContractClosure', 'Unknown', 'Closing', '100', '102', '104', '106', '108', '110', '112', '200', '201', '202', '203', '204', '205', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '340', '360', '361', '362', '400', '401', '402', '500', '503', '505', '507', '600', '609', '612', '615', '9999', '9901')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_milestones" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid, "tenderId" uuid NOT NULL, "milestoneNum" "public"."tender_milestones_milestonenum_enum" NOT NULL, "milestoneTxt" "public"."tender_milestones_milestonetxt_enum" NOT NULL, "isCurrent" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_dee4d72868fb9237de5ee8cfc86" UNIQUE ("lotId", "milestoneNum", "isCurrent"), CONSTRAINT "PK_34e8e1d5c7287e32f12e68ea4b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lots" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "number" integer NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL, "metadata" jsonb, CONSTRAINT "PK_2bb990a4015865cb1daa1d22fd9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenders" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "procurementCategory" character varying, "procurementReferenceNumber" character varying, "budgetAmount" numeric(10,2) NOT NULL DEFAULT '0', "budgetAmountCurrency" character varying NOT NULL, "budgetCode" character varying NOT NULL, "prId" character varying NOT NULL, "marketEstimate" numeric(10,2) NOT NULL DEFAULT '0', "marketEstimateCurrency" character varying NOT NULL, "status" character varying NOT NULL, "metadata" jsonb, "organizationId" character varying NOT NULL, "organizationName" character varying NOT NULL, "tenderDocument" jsonb, "tenderInvitation" jsonb, CONSTRAINT "PK_13fdd4229818a97b5102199463b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "offered-item-summaries" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric(14,2) NOT NULL DEFAULT '0', "amount" numeric(14,2) NOT NULL DEFAULT '0', "offeredPrice" numeric(14,2) NOT NULL DEFAULT '0', "tax" numeric NOT NULL, "currency" character varying NOT NULL, "exchangeRate" numeric(14,2) NOT NULL DEFAULT '0', "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_5fc63ee8b85c2b153fbd5e6d52c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "offered-item-breakdowns" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "billOfQuantityId" uuid NOT NULL, "parentCode" character varying, "code" character varying NOT NULL, "category" character varying NOT NULL, "adjustedQuantity" numeric(14,2) NOT NULL DEFAULT '0', "offeredUnitPrice" numeric(14,2) NOT NULL DEFAULT '0', "originalQuantity" numeric(14,2) DEFAULT '0', "totalAmount" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "exchangeRate" numeric(14,2) DEFAULT '0', CONSTRAINT "PK_446cea4e282e76ce79994369e3e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_technical_teams" ADD CONSTRAINT "FK_16ed8516699dfbc7bad19f13768" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "FK_3182144677e584be4c8019c9f71" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" ADD CONSTRAINT "FK_51054bf8cee67d1f55d9ec5713d" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" ADD CONSTRAINT "FK_ea92a2dce51fc3f48735887b820" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_tenders" ADD CONSTRAINT "FK_c8b6918ab3f533b8c30f5599ede" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" ADD CONSTRAINT "FK_29aed177e3aae66e39b0f933d8a" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_lots" ADD CONSTRAINT "FK_cabd8ab94306ddbec6d07b1693f" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" ADD CONSTRAINT "FK_5e4bba931fddb9266c4200faebb" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" ADD CONSTRAINT "FK_89f1c5eb9f3ccdf1a3c3375254f" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_items" ADD CONSTRAINT "FK_4947733f2123c262df8c24944ae" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_items" ADD CONSTRAINT "FK_8360c30bbca5ccd83eaf16fadac" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_lots" ADD CONSTRAINT "FK_b98897a105f7515c11207ca8804" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "FK_74c9ef57a86737836148803b822" FOREIGN KEY ("technicalPreliminaryAssessmentId") REFERENCES "technical_preliminary_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "FK_4cd4654d6e6459a3ee62f332dd3" FOREIGN KEY ("eqcPreliminaryExaminationId") REFERENCES "eqc_preliminary_examinations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "FK_dede2c868714c3a253649b60c3c" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD CONSTRAINT "FK_817d66b1e0add02f648c877f124" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD CONSTRAINT "FK_960d4c5909b2a64d07602b18a2f" FOREIGN KEY ("parentId") REFERENCES "spd_technical_scoring"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD CONSTRAINT "FK_7f257d2363c8da5a70aef384760" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD CONSTRAINT "FK_79cfc4d67926a83086fa669d3d1" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" ADD CONSTRAINT "FK_9d2c08603e7b08b22e3d3a6b02a" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" ADD CONSTRAINT "FK_aed599239e891a7243f6b4fedf7" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD CONSTRAINT "FK_031f8ca8e326af6c18fac49ba89" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_templates" ADD CONSTRAINT "FK_58b133159821f269d4a9e102981" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" ADD CONSTRAINT "FK_d2552d6e0145a36ec7a3b019342" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" ADD CONSTRAINT "FK_ddd674868cebf0795eee1fd7aac" FOREIGN KEY ("bidFormId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bid_forms" ADD CONSTRAINT "FK_ee16a393f1cf753562e851c56f0" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_contract_forms" ADD CONSTRAINT "FK_ab496b8f6616866278b321794f0" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "FK_0d09038a7c2856a68c38b8a9ff8" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "FK_4221467b4b3a879ae8e9295f94c" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_documentary_evidences" ADD CONSTRAINT "FK_7473a314ef5423fe5a847f306ef" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_opening_checklists" ADD CONSTRAINT "FK_41fba7b1fef84bdde974b4e724d" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD CONSTRAINT "FK_ba4370a68752d5f4eabb6bb3711" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD CONSTRAINT "FK_8b870c240485eb79fb8d83737b0" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD CONSTRAINT "FK_c0f72d8572db88859384b29ef96" FOREIGN KEY ("spdOpeningChecklistId") REFERENCES "spd_opening_checklists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD CONSTRAINT "FK_7323200c8e343ceec41b03f326c" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD CONSTRAINT "FK_8aba0f82e6e77b18e9e7a9d385f" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" ADD CONSTRAINT "FK_90853706993b68593dbb0b8633e" FOREIGN KEY ("technicalQualificationAssessmentId") REFERENCES "technical_qualification_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" ADD CONSTRAINT "FK_72474d19284a1b321904f6a85a3" FOREIGN KEY ("eqcQualificationId") REFERENCES "eqc_qualifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessments" ADD CONSTRAINT "FK_8a7460645ba5245edc7bbbab4f9" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD CONSTRAINT "FK_47b953f933f29ba577f5560f5f6" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD CONSTRAINT "FK_9ecfd4427aa993439739b6b65e4" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessments" ADD CONSTRAINT "FK_b2a5089c12423aa10b5f14ce8dc" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ADD CONSTRAINT "FK_682b03c8b81a12fda829ab48926" FOREIGN KEY ("technicalResponsivenessAssessmentId") REFERENCES "technical_responsiveness_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ADD CONSTRAINT "FK_4980f2b2352cdb1cf4743ea5649" FOREIGN KEY ("sorTechnicalRequirementId") REFERENCES "sor_technical_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" ADD CONSTRAINT "FK_3b9d41f1264232adabc1a493fbd" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_reimburseable_expenses" ADD CONSTRAINT "FK_13cc9a2fe8b38b3e292700bd99a" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ADD CONSTRAINT "FK_86846ef638b3d96853dfd0e8bca" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" ADD CONSTRAINT "FK_a61e9c1b02f826a197432ccac5d" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_fees" ADD CONSTRAINT "FK_01c97aac7ad3d5a8b8a319eed50" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_incidental_costs" ADD CONSTRAINT "FK_d6027efe05b712e68fb6fc5cf59" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_labors" ADD CONSTRAINT "FK_0acf3073e003f8808e52eff7819" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_documents" ADD CONSTRAINT "FK_8f7ae34384e73ab537b8863114d" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_1941a6957ec883c261b003a92f7" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_classifications" ADD CONSTRAINT "FK_0a45e81c8e5f421b80ee4498130" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_participation_fees" ADD CONSTRAINT "FK_bb8523ce3a8e3441e0642278dd7" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_personals" ADD CONSTRAINT "FK_f8ddc0f232115aa707cb1116a6c" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD CONSTRAINT "FK_f4643c48139c99ed56b357ed5ec" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" ADD CONSTRAINT "FK_fb32b5807888d323983d74d196d" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" ADD CONSTRAINT "FK_2aea937a675e2a19962163beaf1" FOREIGN KEY ("eqcDocumentaryEvidenceId") REFERENCES "eqc_documentary_evidences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_documentary_evidences" ADD CONSTRAINT "FK_470cb6f11cdb13be7527a6e65b5" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_due_diligences" ADD CONSTRAINT "FK_444481f0a2b84668668e047a942" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preference_margins" ADD CONSTRAINT "FK_4003ff741f9fbca17a01a6aefff" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_f9b07d7fe0575bf583ac36721eb" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_76e57cba6ff7dd3b57cc86cc7ed" FOREIGN KEY ("parentId") REFERENCES "eqc_technical_scorings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD CONSTRAINT "FK_a9b475d7e1baf128ac85bd5990a" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_awards" ADD CONSTRAINT "FK_360a587c5c63482a136ec4a93d4" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ADD CONSTRAINT "FK_32110ff8c972bd861c32fdacb20" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_preparations" ADD CONSTRAINT "FK_19798e60cc425f76fd8c92ef7bd" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" ADD CONSTRAINT "FK_f74f982a3d5a91345ea8fd96865" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_contract_deliverables" ADD CONSTRAINT "FK_ab389b9345a79eff2840ea0cd87" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_general_provisions" ADD CONSTRAINT "FK_cad96f8e115b1b724ca79295b2a" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_guarantees" ADD CONSTRAINT "FK_a7e3e8ddf4541310672f895986a" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_liabilities" ADD CONSTRAINT "FK_fcab02b2b652023cc66c9a1e341" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_payment_schedules" ADD CONSTRAINT "FK_669e50a60ea369261f632231d98" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_payment_terms" ADD CONSTRAINT "FK_6b17d4efb50d8a5e376f25bb69f" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_f229e2433085212ddf645009e19" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "revision_approvals" ADD CONSTRAINT "FK_39d625c9aff2b69ed302e5d0aab" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_6d1c8c7f705803f0711336a5c33" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_811664b9ff09cd3dc8ca4cf25bd" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_a6d97537359e3863e2baddc0014" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD CONSTRAINT "FK_898061552c1476d5a0a8cc65980" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD CONSTRAINT "FK_2134bf9ff08b1d831c9941ccc1c" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_extensions" ADD CONSTRAINT "FK_d8868df42608791a19c17850e4e" FOREIGN KEY ("guaranteeId") REFERENCES "bid_guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_forfeits" ADD CONSTRAINT "FK_23c5dff36f1c6a2434f5865daac" FOREIGN KEY ("guaranteeId") REFERENCES "bid_guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_releases" ADD CONSTRAINT "FK_1f1321f1526d45828ce5d1e2280" FOREIGN KEY ("guaranteeId") REFERENCES "bid_guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_cancellations" ADD CONSTRAINT "FK_555d1417f5fb030d614e1fde676" FOREIGN KEY ("guaranteeId") REFERENCES "bid_guarantees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" ADD CONSTRAINT "FK_baa963ff6780116204df2c298fe" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_bookmarks" ADD CONSTRAINT "FK_7183a23d8b08073db9ec20e01f2" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" ADD CONSTRAINT "FK_19a734e654f04171cdce776c1aa" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "FK_807061b2fa4325cc72a721138de" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "FK_907ca5c1c8d5c923b3e480122ee" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ADD CONSTRAINT "FK_ff305ca55fdc2a8ee2e143d2c61" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lots" DROP CONSTRAINT "FK_ff305ca55fdc2a8ee2e143d2c61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "FK_907ca5c1c8d5c923b3e480122ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "FK_807061b2fa4325cc72a721138de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" DROP CONSTRAINT "FK_19a734e654f04171cdce776c1aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_bookmarks" DROP CONSTRAINT "FK_7183a23d8b08073db9ec20e01f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" DROP CONSTRAINT "FK_baa963ff6780116204df2c298fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_cancellations" DROP CONSTRAINT "FK_555d1417f5fb030d614e1fde676"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_releases" DROP CONSTRAINT "FK_1f1321f1526d45828ce5d1e2280"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_forfeits" DROP CONSTRAINT "FK_23c5dff36f1c6a2434f5865daac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantee_extensions" DROP CONSTRAINT "FK_d8868df42608791a19c17850e4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" DROP CONSTRAINT "FK_2134bf9ff08b1d831c9941ccc1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" DROP CONSTRAINT "FK_898061552c1476d5a0a8cc65980"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_a6d97537359e3863e2baddc0014"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_811664b9ff09cd3dc8ca4cf25bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_6d1c8c7f705803f0711336a5c33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "revision_approvals" DROP CONSTRAINT "FK_39d625c9aff2b69ed302e5d0aab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_f229e2433085212ddf645009e19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_payment_terms" DROP CONSTRAINT "FK_6b17d4efb50d8a5e376f25bb69f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_payment_schedules" DROP CONSTRAINT "FK_669e50a60ea369261f632231d98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_liabilities" DROP CONSTRAINT "FK_fcab02b2b652023cc66c9a1e341"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_guarantees" DROP CONSTRAINT "FK_a7e3e8ddf4541310672f895986a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_general_provisions" DROP CONSTRAINT "FK_cad96f8e115b1b724ca79295b2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_contract_deliverables" DROP CONSTRAINT "FK_ab389b9345a79eff2840ea0cd87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" DROP CONSTRAINT "FK_f74f982a3d5a91345ea8fd96865"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_preparations" DROP CONSTRAINT "FK_19798e60cc425f76fd8c92ef7bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" DROP CONSTRAINT "FK_32110ff8c972bd861c32fdacb20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_awards" DROP CONSTRAINT "FK_360a587c5c63482a136ec4a93d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP CONSTRAINT "FK_a9b475d7e1baf128ac85bd5990a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_76e57cba6ff7dd3b57cc86cc7ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_f9b07d7fe0575bf583ac36721eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preference_margins" DROP CONSTRAINT "FK_4003ff741f9fbca17a01a6aefff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_due_diligences" DROP CONSTRAINT "FK_444481f0a2b84668668e047a942"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_documentary_evidences" DROP CONSTRAINT "FK_470cb6f11cdb13be7527a6e65b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" DROP CONSTRAINT "FK_2aea937a675e2a19962163beaf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" DROP CONSTRAINT "FK_fb32b5807888d323983d74d196d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP CONSTRAINT "FK_f4643c48139c99ed56b357ed5ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_personals" DROP CONSTRAINT "FK_f8ddc0f232115aa707cb1116a6c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_participation_fees" DROP CONSTRAINT "FK_bb8523ce3a8e3441e0642278dd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_classifications" DROP CONSTRAINT "FK_0a45e81c8e5f421b80ee4498130"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_1941a6957ec883c261b003a92f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_documents" DROP CONSTRAINT "FK_8f7ae34384e73ab537b8863114d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_labors" DROP CONSTRAINT "FK_0acf3073e003f8808e52eff7819"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_incidental_costs" DROP CONSTRAINT "FK_d6027efe05b712e68fb6fc5cf59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_fees" DROP CONSTRAINT "FK_01c97aac7ad3d5a8b8a319eed50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" DROP CONSTRAINT "FK_a61e9c1b02f826a197432ccac5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" DROP CONSTRAINT "FK_86846ef638b3d96853dfd0e8bca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_reimburseable_expenses" DROP CONSTRAINT "FK_13cc9a2fe8b38b3e292700bd99a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" DROP CONSTRAINT "FK_3b9d41f1264232adabc1a493fbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" DROP CONSTRAINT "FK_4980f2b2352cdb1cf4743ea5649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" DROP CONSTRAINT "FK_682b03c8b81a12fda829ab48926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessments" DROP CONSTRAINT "FK_b2a5089c12423aa10b5f14ce8dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP CONSTRAINT "FK_9ecfd4427aa993439739b6b65e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP CONSTRAINT "FK_47b953f933f29ba577f5560f5f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessments" DROP CONSTRAINT "FK_8a7460645ba5245edc7bbbab4f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" DROP CONSTRAINT "FK_72474d19284a1b321904f6a85a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" DROP CONSTRAINT "FK_90853706993b68593dbb0b8633e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP CONSTRAINT "FK_8aba0f82e6e77b18e9e7a9d385f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP CONSTRAINT "FK_7323200c8e343ceec41b03f326c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP CONSTRAINT "FK_c0f72d8572db88859384b29ef96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP CONSTRAINT "FK_8b870c240485eb79fb8d83737b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP CONSTRAINT "FK_ba4370a68752d5f4eabb6bb3711"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_opening_checklists" DROP CONSTRAINT "FK_41fba7b1fef84bdde974b4e724d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_documentary_evidences" DROP CONSTRAINT "FK_7473a314ef5423fe5a847f306ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "FK_4221467b4b3a879ae8e9295f94c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "FK_0d09038a7c2856a68c38b8a9ff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_contract_forms" DROP CONSTRAINT "FK_ab496b8f6616866278b321794f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bid_forms" DROP CONSTRAINT "FK_ee16a393f1cf753562e851c56f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" DROP CONSTRAINT "FK_ddd674868cebf0795eee1fd7aac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" DROP CONSTRAINT "FK_d2552d6e0145a36ec7a3b019342"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_templates" DROP CONSTRAINT "FK_58b133159821f269d4a9e102981"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP CONSTRAINT "FK_031f8ca8e326af6c18fac49ba89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" DROP CONSTRAINT "FK_aed599239e891a7243f6b4fedf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" DROP CONSTRAINT "FK_9d2c08603e7b08b22e3d3a6b02a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP CONSTRAINT "FK_79cfc4d67926a83086fa669d3d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP CONSTRAINT "FK_7f257d2363c8da5a70aef384760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP CONSTRAINT "FK_960d4c5909b2a64d07602b18a2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP CONSTRAINT "FK_817d66b1e0add02f648c877f124"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "FK_dede2c868714c3a253649b60c3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "FK_4cd4654d6e6459a3ee62f332dd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "FK_74c9ef57a86737836148803b822"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_lots" DROP CONSTRAINT "FK_b98897a105f7515c11207ca8804"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_items" DROP CONSTRAINT "FK_8360c30bbca5ccd83eaf16fadac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_items" DROP CONSTRAINT "FK_4947733f2123c262df8c24944ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" DROP CONSTRAINT "FK_89f1c5eb9f3ccdf1a3c3375254f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_items" DROP CONSTRAINT "FK_5e4bba931fddb9266c4200faebb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_lots" DROP CONSTRAINT "FK_cabd8ab94306ddbec6d07b1693f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" DROP CONSTRAINT "FK_29aed177e3aae66e39b0f933d8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_bid_response_tenders" DROP CONSTRAINT "FK_c8b6918ab3f533b8c30f5599ede"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_bidder_keys" DROP CONSTRAINT "FK_ea92a2dce51fc3f48735887b820"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_tenders" DROP CONSTRAINT "FK_51054bf8cee67d1f55d9ec5713d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "FK_3182144677e584be4c8019c9f71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_technical_teams" DROP CONSTRAINT "FK_16ed8516699dfbc7bad19f13768"`,
    );
    await queryRunner.query(`DROP TABLE "offered-item-breakdowns"`);
    await queryRunner.query(`DROP TABLE "offered-item-summaries"`);
    await queryRunner.query(`DROP TABLE "tenders"`);
    await queryRunner.query(`DROP TABLE "lots"`);
    await queryRunner.query(`DROP TABLE "tender_milestones"`);
    await queryRunner.query(
      `DROP TYPE "public"."tender_milestones_milestonetxt_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."tender_milestones_milestonenum_enum"`,
    );
    await queryRunner.query(`DROP TABLE "milestones_trackers"`);
    await queryRunner.query(`DROP TABLE "eqc_preliminary_examinations"`);
    await queryRunner.query(`DROP TABLE "bid_bookmarks"`);
    await queryRunner.query(`DROP TYPE "public"."bid_bookmarks_status_enum"`);
    await queryRunner.query(`DROP TABLE "bid_guarantees"`);
    await queryRunner.query(`DROP TYPE "public"."bid_guarantees_status_enum"`);
    await queryRunner.query(`DROP TABLE "bid_guarantee_cancellations"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_guarantee_cancellations_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_guarantee_releases"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_guarantee_releases_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_guarantee_forfeits"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_guarantee_forfeits_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_guarantee_extensions"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_guarantee_extensions_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "openings"`);
    await queryRunner.query(`DROP TYPE "public"."openings_status_enum"`);
    await queryRunner.query(`DROP TABLE "teams"`);
    await queryRunner.query(`DROP TYPE "public"."teams_teamtype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."teams_envelopetype_enum"`);
    await queryRunner.query(`DROP TABLE "team_members"`);
    await queryRunner.query(`DROP TABLE "bid_opening_minutes"`);
    await queryRunner.query(`DROP TABLE "revision_approvals"`);
    await queryRunner.query(
      `DROP TYPE "public"."revision_approvals_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "scc_payment_terms"`);
    await queryRunner.query(`DROP TABLE "scc_payment_schedules"`);
    await queryRunner.query(`DROP TABLE "scc_liabilities"`);
    await queryRunner.query(`DROP TABLE "scc_guarantees"`);
    await queryRunner.query(`DROP TABLE "scc_general_provisions"`);
    await queryRunner.query(`DROP TABLE "scc_contract_deliverables"`);
    await queryRunner.query(`DROP TABLE "bds_bid_securities"`);
    await queryRunner.query(`DROP TABLE "bds_preparations"`);
    await queryRunner.query(`DROP TABLE "bds_evaluations"`);
    await queryRunner.query(
      `DROP TYPE "public"."bds_evaluations_awardtype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bds_evaluations_selectionmethod_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bds_evaluations_evaluationmethod_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bds_awards"`);
    await queryRunner.query(`DROP TABLE "bds_generals"`);
    await queryRunner.query(`DROP TABLE "eqc_technical_scorings"`);
    await queryRunner.query(`DROP TABLE "eqc_preference_margins"`);
    await queryRunner.query(`DROP TABLE "eqc_due_diligences"`);
    await queryRunner.query(`DROP TABLE "eqc_documentary_evidences"`);
    await queryRunner.query(`DROP TABLE "bid_response_documentary_evidences"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_response_documentary_evidences_documenttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bds_submissions"`);
    await queryRunner.query(
      `DROP TYPE "public"."bds_submissions_enveloptype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "tender_personals"`);
    await queryRunner.query(`DROP TABLE "tender_participation_fees"`);
    await queryRunner.query(`DROP TABLE "tender_classifications"`);
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP TABLE "sor_documents"`);
    await queryRunner.query(`DROP TABLE "sor_labors"`);
    await queryRunner.query(`DROP TABLE "sor_incidental_costs"`);
    await queryRunner.query(`DROP TABLE "sor_fees"`);
    await queryRunner.query(`DROP TABLE "sor_equipments"`);
    await queryRunner.query(`DROP TABLE "sor_bill_of_materials"`);
    await queryRunner.query(`DROP TABLE "sor_reimburseable_expenses"`);
    await queryRunner.query(`DROP TABLE "sor_technical_requirements"`);
    await queryRunner.query(
      `DROP TABLE "technical_responsiveness_assessment_detail"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_responsiveness_assessment_detail_qualified_enum"`,
    );
    await queryRunner.query(
      `DROP TABLE "technical_responsiveness_assessments"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_responsiveness_assessments_qualified_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_registration_details"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_registration_details_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "technical_qualification_assessments"`);
    await queryRunner.query(
      `DROP TYPE "public"."technical_qualification_assessments_qualified_enum"`,
    );
    await queryRunner.query(
      `DROP TABLE "technical_qualification_assessment_detail"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_qualification_assessment_detail_qualified_enum"`,
    );
    await queryRunner.query(`DROP TABLE "eqc_qualifications"`);
    await queryRunner.query(`DROP TABLE "bid_opening_checklists"`);
    await queryRunner.query(`DROP TABLE "spd_opening_checklists"`);
    await queryRunner.query(`DROP TABLE "spd"`);
    await queryRunner.query(`DROP TABLE "spd_documentary_evidences"`);
    await queryRunner.query(`DROP TABLE "tender_spds"`);
    await queryRunner.query(`DROP TABLE "spd_contract_forms"`);
    await queryRunner.query(`DROP TABLE "spd_bid_forms"`);
    await queryRunner.query(`DROP TABLE "bid_response_documents"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_response_documents_documenttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "spd_templates"`);
    await queryRunner.query(`DROP TABLE "spd_qualifications"`);
    await queryRunner.query(`DROP TABLE "spd_professional_settings"`);
    await queryRunner.query(`DROP TABLE "spd_preliminary_evaluations"`);
    await queryRunner.query(`DROP TABLE "spd_preference_margins"`);
    await queryRunner.query(`DROP TABLE "spd_technical_scoring"`);
    await queryRunner.query(`DROP TABLE "bidders_comparisons"`);
    await queryRunner.query(
      `DROP TYPE "public"."bidders_comparisons_bidderstatustxt_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bidders_comparisons_bidderstatus_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bidders_comparisons_milestonetxt_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bidders_comparisons_milestonenum_enum"`,
    );
    await queryRunner.query(`DROP TABLE "technical_preliminary_assessments"`);
    await queryRunner.query(
      `DROP TYPE "public"."technical_preliminary_assessments_qualified_enum"`,
    );
    await queryRunner.query(
      `DROP TABLE "technical_preliminary_assessment_details"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_preliminary_assessment_details_qualified_enum"`,
    );
    await queryRunner.query(`DROP TABLE "opened_bid_response_lots"`);
    await queryRunner.query(
      `DROP TYPE "public"."opened_bid_response_lots_documenttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "opened_bid_response_items"`);
    await queryRunner.query(
      `DROP TYPE "public"."opened_bid_response_items_documenttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_response_items"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_response_items_documenttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_response_lots"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_response_lots_documenttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_registrations"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_registrations_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bid_registrations_enveloptype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "opened_bid_response_tenders"`);
    await queryRunner.query(
      `DROP TYPE "public"."opened_bid_response_tenders_documenttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "shared_bidder_keys"`);
    await queryRunner.query(
      `DROP TYPE "public"."shared_bidder_keys_envelopetype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "bid_response_tenders"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_response_tenders_documenttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "procurement_technical_teams"`);
  }
}

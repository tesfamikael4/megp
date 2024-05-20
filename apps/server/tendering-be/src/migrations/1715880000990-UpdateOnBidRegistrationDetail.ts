import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidRegistrationDetail1715880000990
  implements MigrationInterface
{
  name = 'UpdateOnBidRegistrationDetail1715880000990';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `CREATE TABLE "bidders_comparisons" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationId" uuid NOT NULL, "itemId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "milestoneNum" "public"."bidders_comparisons_milestonenum_enum" NOT NULL, "milestoneTxt" "public"."bidders_comparisons_milestonetxt_enum" NOT NULL, "bidderStatus" "public"."bidders_comparisons_bidderstatus_enum" NOT NULL, "bidderStatusTxt" "public"."bidders_comparisons_bidderstatustxt_enum" NOT NULL, "technicalPoints" integer NOT NULL DEFAULT '0', "financialPoints" integer NOT NULL DEFAULT '0', "isCurrent" boolean NOT NULL DEFAULT true, "passFail" boolean NOT NULL, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_0c1da12cd4af778adc5174ba456" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" ADD "pdfValue" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "document" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" ADD CONSTRAINT "FK_d16cd11c0e106cc71539f114fa6" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidders_comparisons" DROP CONSTRAINT "FK_d16cd11c0e106cc71539f114fa6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "document"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" DROP COLUMN "pdfValue"`,
    );
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
  }
}

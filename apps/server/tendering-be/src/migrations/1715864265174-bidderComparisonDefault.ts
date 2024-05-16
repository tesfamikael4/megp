import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidderComparisonDefault1715864265174
  implements MigrationInterface
{
  name = 'BidderComparisonDefault1715864265174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "milestone"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bidders-comparisons_milestone_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bidders-comparisons_milestonenum_enum" AS ENUM('100', '102', '104', '106', '108', '110', '112', '200', '201', '202', '203', '204', '205', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '340', '360', '361', '362', '400', '401', '402', '500', '503', '505', '507', '600', '609', '612', '615', '9999', '9901')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "milestoneNum" "public"."bidders-comparisons_milestonenum_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bidders-comparisons_milestonetxt_enum" AS ENUM('Initiation', 'Configuration', 'Preparation', 'Revision', 'Submission', 'Approval', 'Publication', 'Solicitation', 'ClarificationRequest', 'ClarificationResponse', 'SiteVisit', 'BidderConference', 'Amendment', 'TenderInvitationClosing', 'Evaluation', 'TechnicalOpening', 'TechnicalOnlyOpening', 'TechnicalCompliance', 'TechnicalQualification', 'TechnicalResponsiveness', 'TechnicalScoring', 'TechnicalEndorsement', 'TechnicalStandstill', 'TechnicalPreEndorsement', 'FinancialOpening', 'FinancialOnlyOpening', 'FinancialCompliance', 'FinancialBidPriceValuation', 'FinancialQualification', 'FinancialScoring', 'PriceAnalysis', 'PostQualification', 'CombinationAssessment', 'FinalEndorsement', 'FinalStandstill', 'FinalPreEndorsement', 'Awarding', 'AwardNegotiation', 'PartialAwarding', 'Contracting', 'ContractSigning', 'LetterOfCreditOpening', 'Mobilization', 'Implementing', 'InspectionAndAcceptance', 'FinalAcceptance', 'ContractClosure', 'Unknown', 'Closing', '100', '102', '104', '106', '108', '110', '112', '200', '201', '202', '203', '204', '205', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '340', '360', '361', '362', '400', '401', '402', '500', '503', '505', '507', '600', '609', '612', '615', '9999', '9901')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "milestoneTxt" "public"."bidders-comparisons_milestonetxt_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bidders-comparisons_bidderstatustxt_enum" AS ENUM('Registered', 'Submitted', 'Withdrawn', 'TechnicalOpeningFailed', 'TechnicalOpeningSucceeded', 'TechnicalComplianceFailed', 'TechnicalComplianceSucceeded', 'TechnicalQualificationFailed', 'TechnicalQualificationSucceeded', 'TechnicalResponsivenessFailed', 'TechnicalResponsivenessSucceeded', 'TechnicalScoringFailed', 'TechnicalScoringSucceeded', 'TechnicalEvaluationFailed', 'TechnicalEvaluationSucceeded', 'FinancialOpeningFailed', 'FinancialOpeningSucceeded', 'FinancialComplianceFailed', 'FinancialComplianceSucceeded', 'FinancialQualificationFailed', 'FinancialQualificationSucceeded', 'FinancialResponsivenessFailed', 'FinancialResponsivenessSucceeded', 'FinancialScoringFailed', 'FinancialScoringSucceeded', 'FinancialEvaluationFailed', 'FinancialEvaluationSucceeded', 'FinancialBidPriceValuationFailed', 'FinancialBidPriceValuationSucceeded', 'PriceAnalysisSucceeded', 'PriceAnalysisFailed', 'PostQualificationSucceeded', 'PostQualificationFailed', 'AwardNegotiationSucceeded', 'AwardNegotiationFailed', 'CombinationEvaluationFailed', 'CombinationEvaluationSucceeded', 'AwardingFailed', 'AwardingSucceeded', 'Contracting', 'Implementation', 'Closed', 'Cancelled', '200', '201', '202', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '400', '401', '501', '601', '900', '999')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "bidderStatusTxt" "public"."bidders-comparisons_bidderstatustxt_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "itemId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "itemId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "bidderStatus"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bidders-comparisons_bidderstatus_enum" AS ENUM('200', '201', '202', '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329', '330', '331', '332', '333', '334', '400', '401', '501', '601', '900', '999')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "bidderStatus" "public"."bidders-comparisons_bidderstatus_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "technicalPoints"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "technicalPoints" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "financialPoints"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "financialPoints" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ALTER COLUMN "isCurrent" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "passFail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "passFail" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "version" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "UQ_dee4d72868fb9237de5ee8cfc86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ALTER COLUMN "isCurrent" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "UQ_dee4d72868fb9237de5ee8cfc86" UNIQUE ("lotId", "milestoneNum", "isCurrent")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "UQ_dee4d72868fb9237de5ee8cfc86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ALTER COLUMN "isCurrent" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "UQ_dee4d72868fb9237de5ee8cfc86" UNIQUE ("lotId", "milestoneNum", "isCurrent")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "version" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "passFail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "passFail" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ALTER COLUMN "isCurrent" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "financialPoints"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "financialPoints" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "technicalPoints"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "technicalPoints" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "bidderStatus"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bidders-comparisons_bidderstatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "bidderStatus" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "itemId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "itemId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "bidderStatusTxt"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bidders-comparisons_bidderstatustxt_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "milestoneTxt"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bidders-comparisons_milestonetxt_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP COLUMN "milestoneNum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bidders-comparisons_milestonenum_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bidders-comparisons_milestone_enum" AS ENUM('100', '102', '104', '106', '108', '110', '112', '200', '201', '202', '203', '204', '205', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '340', '360', '361', '362', '400', '401', '402', '500', '503', '505', '507', '600', '609', '612', '615', '9901', '9999')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD "milestone" "public"."bidders-comparisons_milestone_enum" NOT NULL`,
    );
  }
}

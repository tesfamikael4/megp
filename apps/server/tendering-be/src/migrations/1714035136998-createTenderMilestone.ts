import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenderMilestone1714035136998 implements MigrationInterface {
  name = 'CreateTenderMilestone1714035136998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "technical_preliminary_assessments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationDetailId" uuid NOT NULL, "spdPreliminaryEvaluationId" uuid NOT NULL, "evaluatorId" uuid NOT NULL, "isTeamAssessment" boolean NOT NULL, "status" character varying NOT NULL, "submit" boolean NOT NULL, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "REL_dede2c868714c3a253649b60c3" UNIQUE ("bidRegistrationDetailId"), CONSTRAINT "PK_ad760a22008750ed3fd6d1bcb73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tender_milestones_milestonenum_enum" AS ENUM('100', '102', '104', '106', '108', '110', '112', '200', '201', '202', '203', '204', '205', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '340', '360', '361', '362', '400', '401', '402', '500', '503', '505', '507', '600', '609', '612', '615', '9999', '9901')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tender_milestones_milestonetxt_enum" AS ENUM('Initiation', 'Configuration', 'Preparation', 'Revision', 'Submission', 'Approval', 'Publication', 'Solicitation', 'ClarificationRequest', 'ClarificationResponse', 'SiteVisit', 'BidderConference', 'Amendment', 'TenderInvitationClosing', 'Evaluation', 'TechnicalOpening', 'TechnicalOnlyOpening', 'TechnicalCompliance', 'TechnicalQualification', 'TechnicalResponsiveness', 'TechnicalScoring', 'TechnicalEndorsement', 'TechnicalStandstill', 'TechnicalPreEndorsement', 'FinancialOpening', 'FinancialOnlyOpening', 'FinancialCompliance', 'FinancialBidPriceValuation', 'FinancialQualification', 'FinancialScoring', 'PriceAnalysis', 'PostQualification', 'CombinationAssessment', 'FinalEndorsement', 'FinalStandstill', 'FinalPreEndorsement', 'Awarding', 'AwardNegotiation', 'PartialAwarding', 'Contracting', 'ContractSigning', 'LetterOfCreditOpening', 'Mobilization', 'Implementing', 'InspectionAndAcceptance', 'FinalAcceptance', 'ContractClosure', 'Unknown', 'Closing', '100', '102', '104', '106', '108', '110', '112', '200', '201', '202', '203', '204', '205', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '340', '360', '361', '362', '400', '401', '402', '500', '503', '505', '507', '600', '609', '612', '615', '9999', '9901')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_milestones" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid, "tenderId" uuid NOT NULL, "milestoneNum" "public"."tender_milestones_milestonenum_enum" NOT NULL, "milestoneTxt" "public"."tender_milestones_milestonetxt_enum" NOT NULL, "isCurrent" boolean NOT NULL, CONSTRAINT "UQ_7d45b007cb50e243f8467f54a5f" UNIQUE ("lotId", "isCurrent"), CONSTRAINT "PK_34e8e1d5c7287e32f12e68ea4b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" ADD "isTeamLead" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "technicalPreliminaryAssessmentId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD CONSTRAINT "UQ_7f31fc26819c10e3ee0e4518d84" UNIQUE ("technicalPreliminaryAssessmentId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "FK_dede2c868714c3a253649b60c3c" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "FK_6c79345a5c86175beedd3988909" FOREIGN KEY ("spdPreliminaryEvaluationId") REFERENCES "spd_preliminary_evaluations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "FK_a27b7dd9fa26d06695693ec34e2" FOREIGN KEY ("evaluatorId") REFERENCES "team_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD CONSTRAINT "FK_7f31fc26819c10e3ee0e4518d84" FOREIGN KEY ("technicalPreliminaryAssessmentId") REFERENCES "technical_preliminary_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "FK_807061b2fa4325cc72a721138de" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "FK_907ca5c1c8d5c923b3e480122ee" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "FK_907ca5c1c8d5c923b3e480122ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "FK_807061b2fa4325cc72a721138de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP CONSTRAINT "FK_7f31fc26819c10e3ee0e4518d84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "FK_a27b7dd9fa26d06695693ec34e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "FK_6c79345a5c86175beedd3988909"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "FK_dede2c868714c3a253649b60c3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP CONSTRAINT "UQ_7f31fc26819c10e3ee0e4518d84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "technicalPreliminaryAssessmentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_opening_checklists" DROP COLUMN "isTeamLead"`,
    );
    await queryRunner.query(`DROP TABLE "tender_milestones"`);
    await queryRunner.query(
      `DROP TYPE "public"."tender_milestones_milestonetxt_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."tender_milestones_milestonenum_enum"`,
    );
    await queryRunner.query(`DROP TABLE "technical_preliminary_assessments"`);
  }
}

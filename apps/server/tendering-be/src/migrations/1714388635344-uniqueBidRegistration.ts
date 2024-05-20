import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueBidRegistration1714388635344 implements MigrationInterface {
  name = 'UniqueBidRegistration1714388635344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP CONSTRAINT "FK_7f31fc26819c10e3ee0e4518d84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP CONSTRAINT "UQ_7f31fc26819c10e3ee0e4518d84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "technicalPreliminaryAssessmentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "FK_dede2c868714c3a253649b60c3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "REL_dede2c868714c3a253649b60c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "UQ_a29cb94936f7306724c953436fd" UNIQUE ("bidRegistrationDetailId", "spdPreliminaryEvaluationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "FK_dede2c868714c3a253649b60c3c" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "FK_dede2c868714c3a253649b60c3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "UQ_a29cb94936f7306724c953436fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "REL_dede2c868714c3a253649b60c3" UNIQUE ("bidRegistrationDetailId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "FK_dede2c868714c3a253649b60c3c" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "technicalPreliminaryAssessmentId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD CONSTRAINT "UQ_7f31fc26819c10e3ee0e4518d84" UNIQUE ("technicalPreliminaryAssessmentId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD CONSTRAINT "FK_7f31fc26819c10e3ee0e4518d84" FOREIGN KEY ("technicalPreliminaryAssessmentId") REFERENCES "technical_preliminary_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreliminaryAssessment1714379113763 implements MigrationInterface {
  name = 'PreliminaryAssessment1714379113763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD "evaluatorName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD "checked" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD "remark" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ALTER COLUMN "isTeamAssessment" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ALTER COLUMN "isTeamAssessment" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP COLUMN "remark"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP COLUMN "checked"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP COLUMN "evaluatorName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD "status" character varying NOT NULL`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SorTechnicalRequirmentId1716267582808
  implements MigrationInterface
{
  name = 'SorTechnicalRequirmentId1716267582808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "FK_8427135ffaf205f1edd505d5215"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" DROP CONSTRAINT "FK_86712bec03da5e29cf537a39db8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" DROP COLUMN "spdResponsivenessId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" DROP CONSTRAINT "FK_4980f2b2352cdb1cf4743ea5649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ALTER COLUMN "sorTechnicalRequirementId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ADD CONSTRAINT "FK_4980f2b2352cdb1cf4743ea5649" FOREIGN KEY ("sorTechnicalRequirementId") REFERENCES "sor_technical_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" DROP CONSTRAINT "FK_4980f2b2352cdb1cf4743ea5649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ALTER COLUMN "sorTechnicalRequirementId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ADD CONSTRAINT "FK_4980f2b2352cdb1cf4743ea5649" FOREIGN KEY ("sorTechnicalRequirementId") REFERENCES "sor_technical_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ADD "spdResponsivenessId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" ADD CONSTRAINT "FK_86712bec03da5e29cf537a39db8" FOREIGN KEY ("eqcQualificationId") REFERENCES "spd_qualifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "FK_8427135ffaf205f1edd505d5215" FOREIGN KEY ("eqcPreliminaryExaminationId") REFERENCES "spd_preliminary_evaluations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

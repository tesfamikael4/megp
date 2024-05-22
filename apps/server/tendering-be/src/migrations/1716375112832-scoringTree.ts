import { MigrationInterface, QueryRunner } from 'typeorm';

export class ScoringTree1716375112832 implements MigrationInterface {
  name = 'ScoringTree1716375112832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments" RENAME COLUMN "qualified" TO "totalPoints"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."technical_scoring_assessments_qualified_enum" RENAME TO "technical_scoring_assessments_totalpoints_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_qualification_assessment_details_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_qualification_assessment_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalQualificationAssessmentId" uuid NOT NULL, "eqcQualificationId" uuid NOT NULL, "qualified" "public"."technical_qualification_assessment_details_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "remark" character varying, CONSTRAINT "PK_00d2d8056476521cfbe6dab4ec7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_scoring_assessments_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalScoringAssessmentId" uuid NOT NULL, "eqcTechnicalScoringId" uuid NOT NULL, "remark" character varying, "pointsAwarded" integer NOT NULL, "maxPoints" integer NOT NULL, "parentId" uuid, CONSTRAINT "PK_7f25e47d658de960c4192460a22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."technical_responsiveness_assessment_details_qualified_enum" AS ENUM('NOT_DONE', 'IN_PROGRESS', 'NOT_APPLICABLE', 'NOT_COMPLY', 'COMPLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_responsiveness_assessment_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "technicalResponsivenessAssessmentId" uuid NOT NULL, "sorTechnicalRequirementId" uuid NOT NULL, "qualified" "public"."technical_responsiveness_assessment_details_qualified_enum" NOT NULL DEFAULT 'NOT_DONE', "remark" character varying, CONSTRAINT "PK_13f23813c1bfe40e9c286d51de5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_technical_scorings_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_594d38f1885da99660b198dc387" PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b8916f40d8ff591a4e379aecbc" ON "eqc_technical_scorings_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8ad682c0c1566d34f8d28533fb" ON "eqc_technical_scorings_closure" ("id_descendant") `,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_scoring_assessments_details_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_fc1ad3df37b023a36e3b9550220" PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b6726960500c2ff1ff85bad38" ON "technical_scoring_assessments_details_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b905d51e3d60f885b5664a98c3" ON "technical_scoring_assessments_details_closure" ("id_descendant") `,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments" DROP COLUMN "totalPoints"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments" ADD "totalPoints" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_details" ADD CONSTRAINT "FK_24c3e8c77b5652611ec7bf50763" FOREIGN KEY ("technicalQualificationAssessmentId") REFERENCES "technical_qualification_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_details" ADD CONSTRAINT "FK_7a27de676576b0cd4f56eceb3e2" FOREIGN KEY ("eqcQualificationId") REFERENCES "eqc_qualifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details" ADD CONSTRAINT "FK_b5be07da01d31a126b7ed78b6e1" FOREIGN KEY ("technicalScoringAssessmentId") REFERENCES "technical_scoring_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details" ADD CONSTRAINT "FK_ae84fdbac7b4d8b76ed2b0440ff" FOREIGN KEY ("eqcTechnicalScoringId") REFERENCES "eqc_technical_scorings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details" ADD CONSTRAINT "FK_6ea9e2781a4bf02ac794aa3252d" FOREIGN KEY ("parentId") REFERENCES "technical_scoring_assessments_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_details" ADD CONSTRAINT "FK_6a9ceba3ae194d937ac274450e5" FOREIGN KEY ("technicalResponsivenessAssessmentId") REFERENCES "technical_responsiveness_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_details" ADD CONSTRAINT "FK_21b424ee353c236b10eddd2a4e2" FOREIGN KEY ("sorTechnicalRequirementId") REFERENCES "sor_technical_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings_closure" ADD CONSTRAINT "FK_b8916f40d8ff591a4e379aecbc1" FOREIGN KEY ("id_ancestor") REFERENCES "eqc_technical_scorings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings_closure" ADD CONSTRAINT "FK_8ad682c0c1566d34f8d28533fb7" FOREIGN KEY ("id_descendant") REFERENCES "eqc_technical_scorings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details_closure" ADD CONSTRAINT "FK_4b6726960500c2ff1ff85bad384" FOREIGN KEY ("id_ancestor") REFERENCES "technical_scoring_assessments_details"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details_closure" ADD CONSTRAINT "FK_b905d51e3d60f885b5664a98c35" FOREIGN KEY ("id_descendant") REFERENCES "technical_scoring_assessments_details"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details_closure" DROP CONSTRAINT "FK_b905d51e3d60f885b5664a98c35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details_closure" DROP CONSTRAINT "FK_4b6726960500c2ff1ff85bad384"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings_closure" DROP CONSTRAINT "FK_8ad682c0c1566d34f8d28533fb7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings_closure" DROP CONSTRAINT "FK_b8916f40d8ff591a4e379aecbc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_details" DROP CONSTRAINT "FK_21b424ee353c236b10eddd2a4e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_details" DROP CONSTRAINT "FK_6a9ceba3ae194d937ac274450e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details" DROP CONSTRAINT "FK_6ea9e2781a4bf02ac794aa3252d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details" DROP CONSTRAINT "FK_ae84fdbac7b4d8b76ed2b0440ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments_details" DROP CONSTRAINT "FK_b5be07da01d31a126b7ed78b6e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_details" DROP CONSTRAINT "FK_7a27de676576b0cd4f56eceb3e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_details" DROP CONSTRAINT "FK_24c3e8c77b5652611ec7bf50763"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments" DROP COLUMN "totalPoints"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments" ADD "totalPoints" "public"."technical_scoring_assessments_totalpoints_enum" NOT NULL DEFAULT 'NOT_DONE'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b905d51e3d60f885b5664a98c3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b6726960500c2ff1ff85bad38"`,
    );
    await queryRunner.query(
      `DROP TABLE "technical_scoring_assessments_details_closure"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8ad682c0c1566d34f8d28533fb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b8916f40d8ff591a4e379aecbc"`,
    );
    await queryRunner.query(`DROP TABLE "eqc_technical_scorings_closure"`);
    await queryRunner.query(
      `DROP TABLE "technical_responsiveness_assessment_details"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_responsiveness_assessment_details_qualified_enum"`,
    );
    await queryRunner.query(
      `DROP TABLE "technical_scoring_assessments_details"`,
    );
    await queryRunner.query(
      `DROP TABLE "technical_qualification_assessment_details"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."technical_qualification_assessment_details_qualified_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."technical_scoring_assessments_totalpoints_enum" RENAME TO "technical_scoring_assessments_qualified_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scoring_assessments" RENAME COLUMN "totalPoints" TO "qualified"`,
    );
  }
}

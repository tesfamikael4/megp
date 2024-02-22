import { MigrationInterface, QueryRunner } from 'typeorm';

export class BdsEqc1708602136922 implements MigrationInterface {
  name = 'BdsEqc1708602136922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bds_generals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "jointVentureAllowed" boolean NOT NULL, "maximumNumberOfMembers" integer NOT NULL, "subContractAllowed" boolean NOT NULL, "maximumPercentageContractingAllowed" date NOT NULL, "clarificationDeadline" date NOT NULL, "preBidConferenceRequired" boolean NOT NULL, "preBidConferenceDate" date NOT NULL, "spdId" uuid NOT NULL, "siteVisitAllowed" boolean NOT NULL, CONSTRAINT "REL_a9b475d7e1baf128ac85bd5990" UNIQUE ("tenderId"), CONSTRAINT "REL_bc11ee765c17805cac6e3b2a95" UNIQUE ("spdId"), CONSTRAINT "PK_d6e0368edc816d219b1e649b4af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_submissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "submissionDeadline" date NOT NULL, "openingDate" date NOT NULL, "invitationDate" date NOT NULL, "envelopType" character varying NOT NULL, CONSTRAINT "REL_f4643c48139c99ed56b357ed5e" UNIQUE ("tenderId"), CONSTRAINT "PK_b5b417bdfc6f5fa01996a6c4c09" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_evaluations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "bidEvaluationCurrency" text NOT NULL, "evaluationMethod" character varying NOT NULL, "selectionMethod" character varying NOT NULL, "awardType" character varying NOT NULL, "technicalWeight" integer NOT NULL, "financialWeight" integer NOT NULL, "passingMark" integer NOT NULL, CONSTRAINT "REL_32110ff8c972bd861c32fdacb2" UNIQUE ("tenderId"), CONSTRAINT "PK_081f71b1010b0e8d30c8113264a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_preparations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "currencyOfTheBidForNationalBidders" jsonb NOT NULL, "currencyOfTheBidForInternationalBidders" jsonb NOT NULL, "incotermsEdition" character varying NOT NULL, "incotermType" character varying NOT NULL, "bidValidityPeriod" integer NOT NULL, CONSTRAINT "REL_19798e60cc425f76fd8c92ef7b" UNIQUE ("tenderId"), CONSTRAINT "PK_065f63f73ee399a52aa77aae961" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_awards" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "percentageQuantityIncreased" integer NOT NULL, "percentageQuantityDecreased" integer NOT NULL, "negotiationAllowed" boolean NOT NULL, CONSTRAINT "REL_360a587c5c63482a136ec4a93d" UNIQUE ("tenderId"), CONSTRAINT "PK_d562f5d119de65df4b18dd8f855" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_due_dilegence" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "requirement" character varying, "requirementCondition" character varying NOT NULL, CONSTRAINT "PK_1c46ab0fbc36f953498d31b3301" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_preference_margins" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "name" character varying, "condition" character varying NOT NULL, "margin" integer NOT NULL, CONSTRAINT "PK_8f0740d0fb0e9c99e980bf20039" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_qualifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "factor" character varying NOT NULL, "requirement" character varying NOT NULL, "singleEntityCondition" jsonb NOT NULL, "jvEachPartnerCondition" jsonb NOT NULL, "jvCombinedPartnerCondition" jsonb NOT NULL, "jvAtleastOnePartnerCondition" jsonb NOT NULL, "order" integer NOT NULL, "formLink" character varying NOT NULL, "itbDescription" character varying, "itbReference" character varying NOT NULL, "isRequired" boolean NOT NULL, "spdQualificationId" character varying NOT NULL, CONSTRAINT "PK_388eb2d21f4348e91352b603d4d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_technical_scorings" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "parentId" uuid, "requirement" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "point" integer NOT NULL, "formLink" character varying NOT NULL, "spdTechnicalScoringId" character varying, "spdTechnicalScoringParentId" character varying, "isProfessional" boolean NOT NULL, "hasProfessional" boolean NOT NULL, "validation" jsonb NOT NULL, "isRequired" boolean NOT NULL, CONSTRAINT "REL_76e57cba6ff7dd3b57cc86cc7e" UNIQUE ("parentId"), CONSTRAINT "PK_b77fd2261dfcadd1bf7b7ce220b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_preliminary_examinations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "criteria" character varying NOT NULL, "order" integer NOT NULL, "itbDescription" character varying, "itbReference" character varying NOT NULL, "isRequired" boolean NOT NULL, "requirementCondition" character varying NOT NULL, "type" character varying NOT NULL, "formLink" character varying NOT NULL, "spdEqcPreliminaryExaminationId" character varying NOT NULL, CONSTRAINT "PK_5ef92ca75ba18d713bde11530eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD CONSTRAINT "FK_a9b475d7e1baf128ac85bd5990a" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD CONSTRAINT "FK_bc11ee765c17805cac6e3b2a952" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD CONSTRAINT "FK_f4643c48139c99ed56b357ed5ec" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ADD CONSTRAINT "FK_32110ff8c972bd861c32fdacb20" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_preparations" ADD CONSTRAINT "FK_19798e60cc425f76fd8c92ef7bd" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_awards" ADD CONSTRAINT "FK_360a587c5c63482a136ec4a93d4" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_due_dilegence" ADD CONSTRAINT "FK_4b99cd3b56eaa260dc57d3726a0" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preference_margins" ADD CONSTRAINT "FK_4003ff741f9fbca17a01a6aefff" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD CONSTRAINT "FK_8aba0f82e6e77b18e9e7a9d385f" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_f9b07d7fe0575bf583ac36721eb" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_76e57cba6ff7dd3b57cc86cc7ed" FOREIGN KEY ("parentId") REFERENCES "eqc_technical_scorings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" ADD CONSTRAINT "FK_19a734e654f04171cdce776c1aa" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" DROP CONSTRAINT "FK_19a734e654f04171cdce776c1aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_76e57cba6ff7dd3b57cc86cc7ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_f9b07d7fe0575bf583ac36721eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP CONSTRAINT "FK_8aba0f82e6e77b18e9e7a9d385f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preference_margins" DROP CONSTRAINT "FK_4003ff741f9fbca17a01a6aefff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_due_dilegence" DROP CONSTRAINT "FK_4b99cd3b56eaa260dc57d3726a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_awards" DROP CONSTRAINT "FK_360a587c5c63482a136ec4a93d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_preparations" DROP CONSTRAINT "FK_19798e60cc425f76fd8c92ef7bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" DROP CONSTRAINT "FK_32110ff8c972bd861c32fdacb20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP CONSTRAINT "FK_f4643c48139c99ed56b357ed5ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP CONSTRAINT "FK_bc11ee765c17805cac6e3b2a952"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP CONSTRAINT "FK_a9b475d7e1baf128ac85bd5990a"`,
    );
    await queryRunner.query(`DROP TABLE "eqc_preliminary_examinations"`);
    await queryRunner.query(`DROP TABLE "eqc_technical_scorings"`);
    await queryRunner.query(`DROP TABLE "eqc_qualifications"`);
    await queryRunner.query(`DROP TABLE "eqc_preference_margins"`);
    await queryRunner.query(`DROP TABLE "eqc_due_dilegence"`);
    await queryRunner.query(`DROP TABLE "bds_awards"`);
    await queryRunner.query(`DROP TABLE "bds_preparations"`);
    await queryRunner.query(`DROP TABLE "bds_evaluations"`);
    await queryRunner.query(`DROP TABLE "bds_submissions"`);
    await queryRunner.query(`DROP TABLE "bds_generals"`);
  }
}

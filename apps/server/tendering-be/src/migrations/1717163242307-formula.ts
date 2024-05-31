import { MigrationInterface, QueryRunner } from 'typeorm';

export class Formula1717163242307 implements MigrationInterface {
  name = 'Formula1717163242307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "FK_8427135ffaf205f1edd505d5215"`,
    );
    await queryRunner.query(
      `CREATE TABLE "formula_units" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "representation" character varying NOT NULL, "formulaId" uuid NOT NULL, CONSTRAINT "UQ_c1348cf431199f89c67ee13ec80" UNIQUE ("formulaId", "name"), CONSTRAINT "PK_c1d09c9a75f3168ccafdab6df50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "formulas" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lotId" uuid NOT NULL, "itemId" uuid NOT NULL, CONSTRAINT "PK_deb92fee98f29de4b5d31406823" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" ADD CONSTRAINT "FK_9e96e8aa7553426a5650f4e1072" FOREIGN KEY ("formulaId") REFERENCES "formulas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formulas" ADD CONSTRAINT "FK_ea576a39da5798559a52be42aa3" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formulas" ADD CONSTRAINT "FK_efe9732e985b62a6c7754854866" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "formulas" DROP CONSTRAINT "FK_efe9732e985b62a6c7754854866"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formulas" DROP CONSTRAINT "FK_ea576a39da5798559a52be42aa3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_units" DROP CONSTRAINT "FK_9e96e8aa7553426a5650f4e1072"`,
    );
    await queryRunner.query(`DROP TABLE "formulas"`);
    await queryRunner.query(`DROP TABLE "formula_units"`);
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "FK_8427135ffaf205f1edd505d5215" FOREIGN KEY ("eqcPreliminaryExaminationId") REFERENCES "spd_preliminary_evaluations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

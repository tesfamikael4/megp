import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initail1708498621103 implements MigrationInterface {
  name = 'Initail1708498621103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spd_scc" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "itbReference" character varying NOT NULL, "attribute" character varying NOT NULL, "value" jsonb, "mandate" character varying NOT NULL, "inputType" character varying NOT NULL, "order" integer NOT NULL, "description" character varying NOT NULL, "dependency" jsonb NOT NULL, "readOnly" boolean NOT NULL, "isRequired" boolean NOT NULL, "prefix" character varying NOT NULL, CONSTRAINT "PK_54564d892d97c81916f96c6c371" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_bds" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "prefix" character varying NOT NULL, "itbReference" character varying NOT NULL, "attribute" character varying NOT NULL, "value" jsonb NOT NULL, "mandate" character varying NOT NULL, "inputType" character varying NOT NULL, "order" integer NOT NULL, "description" character varying NOT NULL, "dependency" jsonb NOT NULL, "readOnly" boolean NOT NULL, "isRequired" boolean NOT NULL, "isInternalUse" boolean NOT NULL, CONSTRAINT "PK_a49f3d87d5d448c15ab7cdfdf94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_preference_margins" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "condition" character varying NOT NULL, "name" character varying NOT NULL, "preferenceType" character varying NOT NULL, "margin" numeric NOT NULL, CONSTRAINT "PK_b1cea0ea1235afb0b77cb29aaa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_required_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "sectionLink" jsonb NOT NULL, "evidenceType" jsonb NOT NULL, "evidenceTitle" character varying NOT NULL, "checkOnFirstOpening" boolean NOT NULL, "checkOnSecondOpening" boolean NOT NULL, "checkOnSecondCompliance" boolean NOT NULL, "requiredTo" character varying NOT NULL, "isRequired" boolean NOT NULL, CONSTRAINT "PK_00a6f4f66a10e7bc39c8993fa8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_5982542237cd8de3ee4c9ded4b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_qualifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "factor" character varying NOT NULL, "requirement" text NOT NULL, "attribute" character varying NOT NULL, "value" character varying NOT NULL, "singleEntityCondition" jsonb NOT NULL, "jvCominedCondition" jsonb NOT NULL, "jvEachPartherCondition" jsonb NOT NULL, "jvAtleastOnePartnerCondition" jsonb NOT NULL, "order" character varying NOT NULL, "formLink" character varying NOT NULL, "mandate" character varying NOT NULL, "itbDescription" character varying NOT NULL, CONSTRAINT "PK_d512ad5a2d5f6a790a5a5e793d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_administrative_compliances" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "itbDescription" character varying NOT NULL, "attribute" character varying NOT NULL, "value" character varying NOT NULL, "mandate" character varying NOT NULL, "order" integer NOT NULL, "isRequired" boolean NOT NULL, CONSTRAINT "PK_8bcfcfe7a85b76c916661872a7e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_templates" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "document" jsonb, "spdId" uuid NOT NULL, CONSTRAINT "PK_e2d7118c5872d3f54f78ab3609a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "governingRule" jsonb, "name" character varying NOT NULL, "description" character varying NOT NULL, "marketType" character varying NOT NULL, "procurementCategory" character varying NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_c048f166470e0a788481a2a744c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_technical_scoring" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "orderNo" numeric NOT NULL, "parentId" uuid NOT NULL, "requirement" character varying NOT NULL, "specification" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "point" numeric NOT NULL, "formLink" character varying NOT NULL, "additionalRequirements" character varying NOT NULL, "validation" jsonb NOT NULL, "isRequired" boolean NOT NULL, "isProfessional" boolean NOT NULL, "isRangeBasedCriteria" boolean NOT NULL, CONSTRAINT "PK_94c7ee37dd96288ad502ea3e8cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_scc" ADD CONSTRAINT "FK_4293a67e19773fc97dd6a8fd5ba" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bds" ADD CONSTRAINT "FK_3fa5a61144d7b5eea5f3673968e" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD CONSTRAINT "FK_79cfc4d67926a83086fa669d3d1" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_required_documentary_evidences" ADD CONSTRAINT "FK_5e0fe2b5e8456cba4ef0cc938a9" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_settings" ADD CONSTRAINT "FK_7885efb8db0be2f53cb5cfff0f4" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD CONSTRAINT "FK_031f8ca8e326af6c18fac49ba89" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_administrative_compliances" ADD CONSTRAINT "FK_906e0ae3335f8115ab701efb2b6" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_templates" ADD CONSTRAINT "FK_58b133159821f269d4a9e102981" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD CONSTRAINT "FK_7f257d2363c8da5a70aef384760" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP CONSTRAINT "FK_7f257d2363c8da5a70aef384760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_templates" DROP CONSTRAINT "FK_58b133159821f269d4a9e102981"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_administrative_compliances" DROP CONSTRAINT "FK_906e0ae3335f8115ab701efb2b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP CONSTRAINT "FK_031f8ca8e326af6c18fac49ba89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_settings" DROP CONSTRAINT "FK_7885efb8db0be2f53cb5cfff0f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_required_documentary_evidences" DROP CONSTRAINT "FK_5e0fe2b5e8456cba4ef0cc938a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP CONSTRAINT "FK_79cfc4d67926a83086fa669d3d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bds" DROP CONSTRAINT "FK_3fa5a61144d7b5eea5f3673968e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_scc" DROP CONSTRAINT "FK_4293a67e19773fc97dd6a8fd5ba"`,
    );
    await queryRunner.query(`DROP TABLE "spd_technical_scoring"`);
    await queryRunner.query(`DROP TABLE "spd"`);
    await queryRunner.query(`DROP TABLE "spd_templates"`);
    await queryRunner.query(`DROP TABLE "spd_administrative_compliances"`);
    await queryRunner.query(`DROP TABLE "spd_qualifications"`);
    await queryRunner.query(`DROP TABLE "spd_settings"`);
    await queryRunner.query(`DROP TABLE "spd_required_documentary_evidences"`);
    await queryRunner.query(`DROP TABLE "spd_preference_margins"`);
    await queryRunner.query(`DROP TABLE "spd_bds"`);
    await queryRunner.query(`DROP TABLE "spd_scc"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpdMigrate1703072069073 implements MigrationInterface {
  name = 'SpdMigrate1703072069073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spd_scc" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "itbReference" character varying NOT NULL, "attribute" character varying NOT NULL, "value" jsonb, "manadate" character varying NOT NULL, "inputType" character varying NOT NULL, "order" integer NOT NULL, "description" character varying NOT NULL, "dependency" jsonb NOT NULL, "readOnly" boolean NOT NULL, "isRequired" boolean NOT NULL, "prefix" character varying NOT NULL, CONSTRAINT "PK_54564d892d97c81916f96c6c371" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_technical_scoring" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "orderNo" numeric NOT NULL, "parentId" uuid NOT NULL, "requirement" character varying NOT NULL, "specification" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "point" numeric NOT NULL, "formLink" character varying NOT NULL, "additionalRequirements" character varying NOT NULL, "validation" jsonb NOT NULL, "isRequired" boolean NOT NULL, "isProfessional" boolean NOT NULL, "isRangeBasedCriteria" boolean NOT NULL, CONSTRAINT "PK_94c7ee37dd96288ad502ea3e8cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "governingRule" jsonb, "name" character varying NOT NULL, "description" character varying NOT NULL, "language" character varying NOT NULL, "procurementCategory" character varying NOT NULL, "marketType" character varying NOT NULL, "procurementTool" character varying NOT NULL, "contractingMethod" character varying NOT NULL, "specializationType" jsonb, "isActive" boolean NOT NULL, CONSTRAINT "PK_c048f166470e0a788481a2a744c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_bds" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "prefix" character varying NOT NULL, "itbReference" character varying NOT NULL, "attribute" character varying NOT NULL, "value" jsonb NOT NULL, "manadate" character varying NOT NULL, "inputType" character varying NOT NULL, "order" integer NOT NULL, "description" character varying NOT NULL, "dependency" jsonb NOT NULL, "readOnly" boolean NOT NULL, "isRequired" boolean NOT NULL, "isInternalUse" boolean NOT NULL, CONSTRAINT "PK_a49f3d87d5d448c15ab7cdfdf94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_scc" ADD CONSTRAINT "FK_4293a67e19773fc97dd6a8fd5ba" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD CONSTRAINT "FK_7f257d2363c8da5a70aef384760" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bds" ADD CONSTRAINT "FK_3fa5a61144d7b5eea5f3673968e" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_bds" DROP CONSTRAINT "FK_3fa5a61144d7b5eea5f3673968e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP CONSTRAINT "FK_7f257d2363c8da5a70aef384760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_scc" DROP CONSTRAINT "FK_4293a67e19773fc97dd6a8fd5ba"`,
    );
    await queryRunner.query(`DROP TABLE "spd_bds"`);
    await queryRunner.query(`DROP TABLE "spd"`);
    await queryRunner.query(`DROP TABLE "spd_technical_scoring"`);
    await queryRunner.query(`DROP TABLE "spd_scc"`);
  }
}

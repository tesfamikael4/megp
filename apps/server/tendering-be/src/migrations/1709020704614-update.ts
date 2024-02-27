import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1709020704614 implements MigrationInterface {
  name = 'Update1709020704614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spd_preliminary_evaluations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "criteria" character varying NOT NULL, "type" character varying NOT NULL, "formLink" character varying NOT NULL, "itbReference" character varying NOT NULL, "itbDescription" text, CONSTRAINT "PK_c1e559d384a059e670b0adf7bce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_professional_settings" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "requirement" character varying NOT NULL, "formLink" character varying NOT NULL, "validation" jsonb NOT NULL, CONSTRAINT "PK_893158452f6aaab98a63fa15ecd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP COLUMN "point"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP COLUMN "orderNo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP COLUMN "isRequired"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP COLUMN "isRangeBasedCriteria"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP COLUMN "specification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP COLUMN "requirementCondition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP COLUMN "additionalRequirements"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP COLUMN "name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP COLUMN "preferenceType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "singleEntityCondition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "jvCominedCondition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "jvEachPartherCondition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "jvAtleastOnePartnerCondition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "attribute"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "order"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "mandate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD "itbReference" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD "itbDescription" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "itbReference" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP COLUMN "margin"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD "margin" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "requirement"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "requirement" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "itbDescription"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "itbDescription" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" ADD CONSTRAINT "FK_9d2c08603e7b08b22e3d3a6b02a" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" ADD CONSTRAINT "FK_aed599239e891a7243f6b4fedf7" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" DROP CONSTRAINT "FK_aed599239e891a7243f6b4fedf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" DROP CONSTRAINT "FK_9d2c08603e7b08b22e3d3a6b02a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "itbDescription"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "itbDescription" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "requirement"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "requirement" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP COLUMN "margin"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD "margin" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "itbReference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP COLUMN "itbDescription"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP COLUMN "itbReference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "mandate" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "order" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "value" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "attribute" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "jvAtleastOnePartnerCondition" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "jvEachPartherCondition" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "jvCominedCondition" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "singleEntityCondition" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD "preferenceType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD "additionalRequirements" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD "requirementCondition" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD "specification" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD "isRangeBasedCriteria" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD "isRequired" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD "orderNo" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD "point" numeric NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "spd_professional_settings"`);
    await queryRunner.query(`DROP TABLE "spd_preliminary_evaluations"`);
  }
}

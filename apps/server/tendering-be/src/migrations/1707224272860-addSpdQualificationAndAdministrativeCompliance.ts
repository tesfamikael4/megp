import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpdQualificationAndAdministrativeCompliance1707224272860
  implements MigrationInterface
{
  name = 'AddSpdQualificationAndAdministrativeCompliance1707224272860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spd_qualifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "factor" character varying NOT NULL, "requirement" text NOT NULL, "attribute" character varying NOT NULL, "value" character varying NOT NULL, "singleEntityCondition" jsonb NOT NULL, "jvCominedCondition" jsonb NOT NULL, "jvEachPartherCondition" jsonb NOT NULL, "jvAtleastOnePartnerCondition" jsonb NOT NULL, "order" character varying NOT NULL, "formLink" character varying NOT NULL, "mandate" character varying NOT NULL, "itbDescription" character varying NOT NULL, CONSTRAINT "PK_d512ad5a2d5f6a790a5a5e793d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_administrative_compliances" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "itbDescription" character varying NOT NULL, "attribute" character varying NOT NULL, "value" character varying NOT NULL, "mandate" character varying NOT NULL, "order" integer NOT NULL, "isRequired" boolean NOT NULL, CONSTRAINT "PK_8bcfcfe7a85b76c916661872a7e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD CONSTRAINT "FK_031f8ca8e326af6c18fac49ba89" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_administrative_compliances" ADD CONSTRAINT "FK_906e0ae3335f8115ab701efb2b6" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_administrative_compliances" DROP CONSTRAINT "FK_906e0ae3335f8115ab701efb2b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP CONSTRAINT "FK_031f8ca8e326af6c18fac49ba89"`,
    );
    await queryRunner.query(`DROP TABLE "spd_administrative_compliances"`);
    await queryRunner.query(`DROP TABLE "spd_qualifications"`);
  }
}

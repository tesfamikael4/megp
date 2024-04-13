import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDocumentaryEvidenceAndNote1713001599887
  implements MigrationInterface
{
  name = 'AddDocumentaryEvidenceAndNote1713001599887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spd_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "checkOnFirstCompliance" boolean NOT NULL, "checkOnFirstOpening" boolean NOT NULL, "checkOnSecondCompliance" boolean NOT NULL, "checkOnSecondOpening" boolean NOT NULL, "evidenceTitle" character varying NOT NULL, "evidenceType" character varying NOT NULL, CONSTRAINT "PK_b717c9ee36bfa062c4ffb923a38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "checkOnFirstCompliance" boolean NOT NULL, "checkOnFirstOpening" boolean NOT NULL, "checkOnSecondCompliance" boolean NOT NULL, "checkOnSecondOpening" boolean NOT NULL, "evidenceTitle" character varying NOT NULL, "evidenceType" character varying NOT NULL, "spdDocumentaryEvidenceId" uuid, CONSTRAINT "PK_41690111cede6e13a16fb9a2d82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "content" character varying NOT NULL, "key" character varying NOT NULL, "metadata" jsonb, "objectId" character varying NOT NULL, "objectType" character varying NOT NULL, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_documentary_evidences" ADD CONSTRAINT "FK_7473a314ef5423fe5a847f306ef" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_documentary_evidences" ADD CONSTRAINT "FK_470cb6f11cdb13be7527a6e65b5" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_f229e2433085212ddf645009e19" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_f229e2433085212ddf645009e19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_documentary_evidences" DROP CONSTRAINT "FK_470cb6f11cdb13be7527a6e65b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_documentary_evidences" DROP CONSTRAINT "FK_7473a314ef5423fe5a847f306ef"`,
    );
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "eqc_documentary_evidences"`);
    await queryRunner.query(`DROP TABLE "spd_documentary_evidences"`);
  }
}

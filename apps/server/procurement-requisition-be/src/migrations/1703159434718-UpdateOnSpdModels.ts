import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnSpdModels1703159434718 implements MigrationInterface {
  name = 'UpdateOnSpdModels1703159434718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_scc" RENAME COLUMN "manadate" TO "mandate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bds" RENAME COLUMN "manadate" TO "mandate"`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_preference_margins" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "condition" character varying NOT NULL, "name" character varying NOT NULL, "preferenceType" character varying NOT NULL, "margin" numeric NOT NULL, CONSTRAINT "PK_b1cea0ea1235afb0b77cb29aaa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_5982542237cd8de3ee4c9ded4b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_required_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "sectionLink" jsonb NOT NULL, "evidenceType" jsonb NOT NULL, "evidenceTitle" character varying NOT NULL, "checkOnFirstOpening" boolean NOT NULL, "checkOnSecondOpening" boolean NOT NULL, "checkOnSecondCompliance" boolean NOT NULL, "requiredTo" character varying NOT NULL, "isRequired" boolean NOT NULL, CONSTRAINT "PK_00a6f4f66a10e7bc39c8993fa8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD CONSTRAINT "FK_79cfc4d67926a83086fa669d3d1" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_settings" ADD CONSTRAINT "FK_7885efb8db0be2f53cb5cfff0f4" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_required_documentary_evidences" ADD CONSTRAINT "FK_5e0fe2b5e8456cba4ef0cc938a9" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_required_documentary_evidences" DROP CONSTRAINT "FK_5e0fe2b5e8456cba4ef0cc938a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_settings" DROP CONSTRAINT "FK_7885efb8db0be2f53cb5cfff0f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP CONSTRAINT "FK_79cfc4d67926a83086fa669d3d1"`,
    );
    await queryRunner.query(`DROP TABLE "spd_required_documentary_evidences"`);
    await queryRunner.query(`DROP TABLE "spd_settings"`);
    await queryRunner.query(`DROP TABLE "spd_preference_margins"`);
    await queryRunner.query(
      `ALTER TABLE "spd_bds" RENAME COLUMN "mandate" TO "manadate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_scc" RENAME COLUMN "mandate" TO "manadate"`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Note1707234742849 implements MigrationInterface {
  name = 'Note1707234742849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "objectId" uuid NOT NULL, "objectType" character varying NOT NULL, "parentId" uuid NOT NULL, "content" text NOT NULL, "metaData" jsonb NOT NULL, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_a6d728a29941461d789c7c98f3d" FOREIGN KEY ("parentId") REFERENCES "notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_a6d728a29941461d789c7c98f3d"`,
    );
    await queryRunner.query(`DROP TABLE "notes"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyHashTable1711995442818 implements MigrationInterface {
  name = 'ModifyHashTable1711995442818';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hashes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hash" character varying NOT NULL, "originalData" jsonb NOT NULL, "objectId" character varying NOT NULL, "objectType" character varying NOT NULL, "createdBy" character varying NOT NULL, CONSTRAINT "PK_5448e0a870142d3259f11b9fac0" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "hashes"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Document1709623299654 implements MigrationInterface {
  name = 'Document1709623299654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "fileInfo" jsonb NOT NULL, "itemId" character varying NOT NULL, "type" character varying NOT NULL, "version" integer NOT NULL, "key" character varying NOT NULL, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "documents"`);
  }
}

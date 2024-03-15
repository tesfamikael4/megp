import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClarificationInit1710402905993 implements MigrationInterface {
  name = 'ClarificationInit1710402905993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clarification_response" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rephrasedQuestion" character varying NOT NULL, "response" character varying NOT NULL, "title" character varying, "fileInfo" jsonb, "responderId" uuid NOT NULL, CONSTRAINT "PK_620b2d9bf9b7baead0bcc1298f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "clarification_requests" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "requesterId" uuid NOT NULL, "requesterEmail" character varying NOT NULL, "objectId" uuid NOT NULL, "objectType" character varying NOT NULL, "subject" character varying NOT NULL, "request" character varying NOT NULL, "title" character varying, "fileInfo" jsonb, "tags" text, "clarificationResponseId" uuid, CONSTRAINT "PK_c35168d4028a698416ca185b47e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "clarification_requests" ADD CONSTRAINT "FK_5d8f406d8db9cd0c882f9bc8480" FOREIGN KEY ("clarificationResponseId") REFERENCES "clarification_response"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clarification_requests" DROP CONSTRAINT "FK_5d8f406d8db9cd0c882f9bc8480"`,
    );
    await queryRunner.query(`DROP TABLE "clarification_requests"`);
    await queryRunner.query(`DROP TABLE "clarification_response"`);
  }
}

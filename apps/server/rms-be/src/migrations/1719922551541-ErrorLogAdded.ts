import { MigrationInterface, QueryRunner } from 'typeorm';

export class ErrorLogAdded1719922551541 implements MigrationInterface {
  name = 'ErrorLogAdded1719922551541';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rabbit_mq_errors" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" jsonb NOT NULL, "error" jsonb NOT NULL, "queue" character varying NOT NULL, "application" character varying NOT NULL, CONSTRAINT "PK_33d1ecf2f2f3ed7671c6e6bfc48" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rabbit_mq_errors"`);
  }
}

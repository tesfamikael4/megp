import { MigrationInterface, QueryRunner } from 'typeorm';

export class Reason1706059980077 implements MigrationInterface {
  name = 'Reason1706059980077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reasons" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "objectId" uuid NOT NULL, "activityId" uuid NOT NULL, "type" character varying NOT NULL, "reason" text NOT NULL, "remark" text NOT NULL, CONSTRAINT "PK_b8104b87e316aacce0c709000a2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reasons"`);
  }
}

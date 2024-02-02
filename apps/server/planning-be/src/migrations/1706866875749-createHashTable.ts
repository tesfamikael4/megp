import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHashTable1706866875749 implements MigrationInterface {
  name = 'CreateHashTable1706866875749';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hash" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hash" character varying NOT NULL, "objectId" character varying NOT NULL, "objectType" character varying NOT NULL, "createdBy" character varying NOT NULL, CONSTRAINT "PK_52e086647be843feb88911976c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "CHK_a4b4b08a756e882fffd9c9738d" CHECK ("amount" >= 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "CHK_a4b4b08a756e882fffd9c9738d"`,
    );
    await queryRunner.query(`DROP TABLE "hash"`);
  }
}

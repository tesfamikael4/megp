import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHash1706864299678 implements MigrationInterface {
  name = 'CreateHash1706864299678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hash" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hash" character varying NOT NULL, "objectId" character varying NOT NULL, "objectType" character varying NOT NULL, "createdBy" character varying NOT NULL, CONSTRAINT "PK_52e086647be843feb88911976c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "CHK_9caead8d055e76dccca9d9fa70" CHECK ("amount" >= 0 AND "order" >= 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "CHK_9caead8d055e76dccca9d9fa70"`,
    );
    await queryRunner.query(`DROP TABLE "hash"`);
  }
}

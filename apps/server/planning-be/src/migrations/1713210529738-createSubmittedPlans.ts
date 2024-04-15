import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubmittedPlans1713210529738 implements MigrationInterface {
  name = 'CreateSubmittedPlans1713210529738';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "submitted_plans" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plan" jsonb NOT NULL, "objectType" character varying NOT NULL, CONSTRAINT "PK_6c0f05f015246eb04fe0d93d90b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "submitted_plans"`);
  }
}

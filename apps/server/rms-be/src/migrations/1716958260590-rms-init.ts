import { MigrationInterface, QueryRunner } from 'typeorm';

export class RmsInit1716958260590 implements MigrationInterface {
  name = 'RmsInit1716958260590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tender_notices_objecttype_enum" AS ENUM('TENDER', 'RFX')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_notices" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "objectId" uuid NOT NULL, "objectType" "public"."tender_notices_objecttype_enum" NOT NULL, "name" character varying NOT NULL, "description" character varying, "procurementCategory" character varying, "procurementReferenceNumber" character varying, "budgetCode" character varying NOT NULL, "prId" character varying NOT NULL, "status" character varying NOT NULL, "metadata" jsonb, "organizationId" character varying NOT NULL, "organizationName" character varying NOT NULL, "publishmentDate" TIMESTAMP NOT NULL, "closingDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_322d4bb25379c11d749a748561f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tender_notices"`);
    await queryRunner.query(
      `DROP TYPE "public"."tender_notices_objecttype_enum"`,
    );
  }
}

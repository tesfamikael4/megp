import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcurementThreshold1701762182200 implements MigrationInterface {
  name = 'ProcurementThreshold1701762182200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "procurement_thresholds" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "procurementType" character varying NOT NULL, "minThreshold" numeric(10,2) NOT NULL DEFAULT '0', "maxThreshold" numeric(10,2) NOT NULL DEFAULT '0', "procurementMethod" character varying NOT NULL, "approvalDelegation" character varying NOT NULL, CONSTRAINT "PK_a33c4edc280f155ab8c6f5e017c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "procurement_thresholds"`);
  }
}

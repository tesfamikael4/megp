import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueOnFormulaImplementation1719581364427
  implements MigrationInterface
{
  name = 'UniqueOnFormulaImplementation1719581364427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" DROP CONSTRAINT "UQ_6454028972ebc8a7ffd9ce6657d"`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "fileInfo" jsonb NOT NULL, "itemId" character varying NOT NULL, "type" character varying NOT NULL, "version" integer NOT NULL, "key" character varying NOT NULL, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "submitted_evaluations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plan" jsonb NOT NULL, "objectType" character varying NOT NULL, "objectId" uuid NOT NULL, "version" integer NOT NULL, CONSTRAINT "PK_dad0af1b31c2470984189de2eba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" ADD CONSTRAINT "UQ_0a877267d66795250c94e9ee86d" UNIQUE ("lotId", "name", "itemId", "bidderId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" DROP CONSTRAINT "UQ_0a877267d66795250c94e9ee86d"`,
    );
    await queryRunner.query(`DROP TABLE "submitted_evaluations"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" ADD CONSTRAINT "UQ_6454028972ebc8a7ffd9ce6657d" UNIQUE ("name", "lotId")`,
    );
  }
}

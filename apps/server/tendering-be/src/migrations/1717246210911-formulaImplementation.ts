import { MigrationInterface, QueryRunner } from 'typeorm';

export class FormulaImplementation1717246210911 implements MigrationInterface {
  name = 'FormulaImplementation1717246210911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."formula_implementations_type_enum" AS ENUM('ADDITION', 'DEDUCTION', 'TAXES')`,
    );
    await queryRunner.query(
      `CREATE TABLE "formula_implementations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "representation" character varying NOT NULL, "lotId" uuid NOT NULL, "type" "public"."formula_implementations_type_enum" NOT NULL, "itemId" uuid NOT NULL, "bidderId" uuid NOT NULL, CONSTRAINT "UQ_6454028972ebc8a7ffd9ce6657d" UNIQUE ("lotId", "name"), CONSTRAINT "PK_f7c96c429db8b2ff8780581bffc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" ADD CONSTRAINT "FK_b3bbcad80e0b7ca2e2661cad6a7" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" ADD CONSTRAINT "FK_14dae6cde3d2084776d6f527a75" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" DROP CONSTRAINT "FK_14dae6cde3d2084776d6f527a75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formula_implementations" DROP CONSTRAINT "FK_b3bbcad80e0b7ca2e2661cad6a7"`,
    );
    await queryRunner.query(`DROP TABLE "formula_implementations"`);
    await queryRunner.query(
      `DROP TYPE "public"."formula_implementations_type_enum"`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitProcurementRequisition1708085149496
  implements MigrationInterface
{
  name = 'InitProcurementRequisition1708085149496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying NOT NULL, "contentType" character varying NOT NULL, "bucketName" character varying NOT NULL, "originalName" character varying NOT NULL, "filepath" character varying NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_95e8f97e178311e7eb65e632897" UNIQUE ("fileName"), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "timelines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timeline" character varying, "order" integer NOT NULL, "dueDate" TIMESTAMP NOT NULL, "appDueDate" TIMESTAMP, "period" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_40fcb15a7d7044c9487539f910e" UNIQUE ("order", "procurementRequisitionId", "deletedAt"), CONSTRAINT "CHK_a94f3086bee125bb96621edef5" CHECK ("order" >= 0 AND "period" >= 0), CONSTRAINT "PK_b7e242fccf271037f4d6a00d9dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemCode" character varying NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "description" character varying, "unitPrice" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "quantity" numeric NOT NULL, "measurement" character varying NOT NULL, "uom" character varying NOT NULL, "budgetCode" jsonb NOT NULL, "classification" jsonb NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_909b7e63d149372b8b97bf42f9e" UNIQUE ("procurementRequisitionId", "itemCode", "currency", "measurement", "deletedAt"), CONSTRAINT "CHK_611ccc8398c4617f991c5c258a" CHECK ("unitPrice" >= 0 AND "quantity" >= 0), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "PK_fd435389f004619abb20079c29b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."procurement_requisitions_procurementapplication_enum" AS ENUM('tendering', 'purchasing', 'auctioning')`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisitions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization" jsonb NOT NULL, "name" character varying NOT NULL, "description" character varying, "procurementReference" character varying NOT NULL, "userReference" character varying NOT NULL, "budgetYear" jsonb NOT NULL, "totalEstimatedAmount" numeric(14,2) NOT NULL DEFAULT '0', "calculatedAmount" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL DEFAULT 'USD', "procurementApplication" "public"."procurement_requisitions_procurementapplication_enum" NOT NULL DEFAULT 'tendering', "budgetCode" jsonb NOT NULL, "isPlanned" boolean NOT NULL DEFAULT false, "isMultiYear" boolean NOT NULL DEFAULT false, "isFundAvailable" boolean NOT NULL DEFAULT false, "remark" character varying, "status" character varying NOT NULL DEFAULT 'Draft', CONSTRAINT "UQ_f42e85c831489da44917a4b35c7" UNIQUE ("procurementReference"), CONSTRAINT "UQ_742abcd7d3c08cdc1fd90b3384b" UNIQUE ("userReference"), CONSTRAINT "UQ_49fb9d574dbc45dd6cd704f0322" UNIQUE ("procurementReference", "deletedAt"), CONSTRAINT "PK_6d0ad196f5ce5943ac50e920255" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fundingSource" character varying NOT NULL, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "donor" jsonb NOT NULL, "targetGroup" jsonb NOT NULL, "isOnline" boolean NOT NULL DEFAULT true, "contract" json NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "REL_80a238a65e77152cca669d86c4" UNIQUE ("procurementRequisitionId"), CONSTRAINT "PK_8685ab6b89ae9fe4d5319ab84ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_c88edb4271071771d3a598d7983" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "timelines" ADD CONSTRAINT "FK_ab8ea9dfb41b1e864b6722f6499" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_cd6fb7fa55feffd1695dc5a4a68" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_teams" ADD CONSTRAINT "FK_c273a604a1a97e532a581cb197d" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "FK_80a238a65e77152cca669d86c44" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "FK_80a238a65e77152cca669d86c44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_teams" DROP CONSTRAINT "FK_c273a604a1a97e532a581cb197d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_cd6fb7fa55feffd1695dc5a4a68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "timelines" DROP CONSTRAINT "FK_ab8ea9dfb41b1e864b6722f6499"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_c88edb4271071771d3a598d7983"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "procurement_requisitions"`);
    await queryRunner.query(
      `DROP TYPE "public"."procurement_requisitions_procurementapplication_enum"`,
    );
    await queryRunner.query(`DROP TABLE "technical_teams"`);
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP TABLE "timelines"`);
    await queryRunner.query(`DROP TABLE "documents"`);
  }
}

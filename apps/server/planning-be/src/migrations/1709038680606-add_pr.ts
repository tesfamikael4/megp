import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPr1709038680606 implements MigrationInterface {
  name = 'AddPr1709038680606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fundingSource" character varying NOT NULL, "procurementMethod" character varying NOT NULL, "procurementType" character varying NOT NULL, "donor" jsonb NOT NULL, "targetGroup" jsonb NOT NULL, "isOnline" boolean NOT NULL DEFAULT true, "contract" json NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "REL_80a238a65e77152cca669d86c4" UNIQUE ("procurementRequisitionId"), CONSTRAINT "PK_8685ab6b89ae9fe4d5319ab84ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_mechanism_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileInfo" jsonb NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "PK_a4146136b816c4cff40d2e36f47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_mechanism_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemCode" character varying NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "description" character varying, "unitPrice" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "quantity" numeric NOT NULL, "measurement" character varying NOT NULL, "uom" character varying, "bom" character varying, "budgetId" uuid, "classification" jsonb NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_931e16751803c36aea8ff94d5be" UNIQUE ("procurementRequisitionId", "itemCode", "currency", "measurement", "deletedAt"), CONSTRAINT "CHK_32aa27d196f037c3cc9720bade" CHECK ("unitPrice" >= 0 AND "quantity" >= 0), CONSTRAINT "PK_fe1361c3cf19e92f87d5af005c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_mechanism_technical_teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "PK_f50e5a8c00b71300006d4ea9222" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_mechanism_timelines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timeline" character varying, "order" integer NOT NULL, "dueDate" TIMESTAMP NOT NULL, "appDueDate" TIMESTAMP, "period" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_6a98035d2d491206d11c2942d6e" UNIQUE ("order", "procurementRequisitionId", "deletedAt"), CONSTRAINT "CHK_985b4c48389ea7e53bff057108" CHECK ("order" >= 0 AND "period" >= 0), CONSTRAINT "PK_edaef55cf2b7d6e6a5afea5d5a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisitions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "procurementReference" character varying NOT NULL, "userReference" character varying NOT NULL, "totalEstimatedAmount" numeric(14,2) NOT NULL DEFAULT '0', "calculatedAmount" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL DEFAULT 'USD', "procurementApplication" "public"."procurement_requisitions_procurementapplication_enum" NOT NULL DEFAULT 'tendering', "budgetId" uuid, "isPlanned" boolean NOT NULL DEFAULT false, "isMultiYear" boolean NOT NULL DEFAULT false, "isFundAvailable" boolean NOT NULL DEFAULT false, "isCustom" boolean NOT NULL DEFAULT true, "remark" character varying, "status" character varying NOT NULL DEFAULT 'Draft', CONSTRAINT "UQ_f42e85c831489da44917a4b35c7" UNIQUE ("procurementReference"), CONSTRAINT "UQ_742abcd7d3c08cdc1fd90b3384b" UNIQUE ("userReference"), CONSTRAINT "UQ_49fb9d574dbc45dd6cd704f0322" UNIQUE ("procurementReference", "deletedAt"), CONSTRAINT "PK_6d0ad196f5ce5943ac50e920255" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "FK_80a238a65e77152cca669d86c44" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanism_documents" ADD CONSTRAINT "FK_d28c1c51a0b260ef834de481ced" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanism_items" ADD CONSTRAINT "FK_40374aa52e7e12284036c5a9d13" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanism_items" ADD CONSTRAINT "FK_77c2d43482e37165e7aae36cb11" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanism_technical_teams" ADD CONSTRAINT "FK_f45b031c5b5f58b57b482f793f1" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanism_timelines" ADD CONSTRAINT "FK_1b0607d350e80f28570304cbccf" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "FK_5fe6db95830f297255f4ae718aa" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "FK_5fe6db95830f297255f4ae718aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanism_timelines" DROP CONSTRAINT "FK_1b0607d350e80f28570304cbccf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanism_technical_teams" DROP CONSTRAINT "FK_f45b031c5b5f58b57b482f793f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanism_items" DROP CONSTRAINT "FK_77c2d43482e37165e7aae36cb11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanism_items" DROP CONSTRAINT "FK_40374aa52e7e12284036c5a9d13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanism_documents" DROP CONSTRAINT "FK_d28c1c51a0b260ef834de481ced"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "FK_80a238a65e77152cca669d86c44"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_requisitions"`);
    await queryRunner.query(`DROP TABLE "procurement_mechanism_timelines"`);
    await queryRunner.query(
      `DROP TABLE "procurement_mechanism_technical_teams"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_mechanism_items"`);
    await queryRunner.query(`DROP TABLE "procurement_mechanism_documents"`);
    await queryRunner.query(`DROP TABLE "procurement_mechanisms"`);
  }
}

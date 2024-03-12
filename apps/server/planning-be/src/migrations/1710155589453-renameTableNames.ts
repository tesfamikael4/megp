import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTableNames1710155589453 implements MigrationInterface {
  name = 'RenameTableNames1710155589453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileInfo" jsonb NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "PK_9c166d52ffb1af4db4ceb248318" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemCode" character varying NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "description" character varying, "unitPrice" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "quantity" numeric NOT NULL, "measurement" character varying NOT NULL, "uom" character varying, "bom" character varying, "budgetId" uuid, "classification" character varying, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_907ed0d7efa729947ccc7930dfc" UNIQUE ("procurementRequisitionId", "itemCode", "currency", "measurement", "deletedAt"), CONSTRAINT "UQ_0f4c3d64833f192fd6005e3d787" UNIQUE ("organizationId", "itemCode", "deletedAt"), CONSTRAINT "CHK_c79448c957e5208d16d9fba6cb" CHECK ("unitPrice" >= 0 AND "quantity" >= 0), CONSTRAINT "PK_f229fd2ab23693583f54e88df26" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_technical_teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "PK_7ebd3193d73796eec34459c0be1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_timelines" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timeline" character varying, "order" integer NOT NULL, "dueDate" TIMESTAMP NOT NULL, "appDueDate" TIMESTAMP, "period" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "UQ_ecf1a3af519afd5f18124d4f2b6" UNIQUE ("order", "procurementRequisitionId", "deletedAt"), CONSTRAINT "CHK_786f19b5666b9fde9cb85b4120" CHECK ("order" >= 0 AND "period" >= 0), CONSTRAINT "PK_d3f71f6b05ee1e054b474385134" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" ADD CONSTRAINT "FK_927692bdb26c6df5886dd3b25f2" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "FK_1bf7943ead57197f827572a77d0" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD CONSTRAINT "FK_6f8554407c58ad45931f91fcdc1" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" ADD CONSTRAINT "FK_9e4487fbd9ed899406395491d26" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ADD CONSTRAINT "FK_2a6c4b46c333e2320278bad7340" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" DROP CONSTRAINT "FK_2a6c4b46c333e2320278bad7340"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_technical_teams" DROP CONSTRAINT "FK_9e4487fbd9ed899406395491d26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "FK_6f8554407c58ad45931f91fcdc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP CONSTRAINT "FK_1bf7943ead57197f827572a77d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_documents" DROP CONSTRAINT "FK_927692bdb26c6df5886dd3b25f2"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_requisition_timelines"`);
    await queryRunner.query(
      `DROP TABLE "procurement_requisition_technical_teams"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_requisition_items"`);
    await queryRunner.query(`DROP TABLE "procurement_requisition_documents"`);
  }
}

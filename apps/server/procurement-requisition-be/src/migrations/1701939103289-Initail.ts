import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initail1701939103289 implements MigrationInterface {
  name = 'Initail1701939103289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan_activities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "postBudgetPlanId" uuid NOT NULL, CONSTRAINT "PK_79a334af6584c8ba10c27e751ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_budget_plan" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, CONSTRAINT "PK_4bb20fba6f0977bf769ef6b88e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_activities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "procurementRequisitionId" uuid NOT NULL, "postBudgetPlanActivityId" uuid NOT NULL, CONSTRAINT "PK_1858e1993316f1a640665a12987" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisitions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "referenceNumber" character varying NOT NULL, "totalEstimatedAmount" double precision NOT NULL, "status" character varying NOT NULL, "postBudgetPlanId" uuid NOT NULL, CONSTRAINT "PK_6d0ad196f5ce5943ac50e920255" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_requisition_attachments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying NOT NULL, "fileType" character varying NOT NULL, "bucketName" character varying NOT NULL, "originalName" character varying NOT NULL, "attachmentUrl" character varying, "path" character varying NOT NULL, "procurementRequisitionId" uuid NOT NULL, CONSTRAINT "PK_b637fa5a0d8c5f72d1ba7d14391" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" ADD CONSTRAINT "FK_6bf41fbc3395df07f01a1ad53af" FOREIGN KEY ("postBudgetPlanId") REFERENCES "post_budget_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD CONSTRAINT "FK_566fc99056125d39cbf05b2d7c2" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD CONSTRAINT "FK_c0184be189b8463828d5833a795" FOREIGN KEY ("postBudgetPlanActivityId") REFERENCES "post_budget_plan_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD CONSTRAINT "FK_2fef51181a2a512503ed7b57ff8" FOREIGN KEY ("postBudgetPlanId") REFERENCES "post_budget_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_attachments" ADD CONSTRAINT "FK_68f414950e1552e182fec3cc0e6" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_attachments" DROP CONSTRAINT "FK_68f414950e1552e182fec3cc0e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP CONSTRAINT "FK_2fef51181a2a512503ed7b57ff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP CONSTRAINT "FK_c0184be189b8463828d5833a795"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP CONSTRAINT "FK_566fc99056125d39cbf05b2d7c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_activities" DROP CONSTRAINT "FK_6bf41fbc3395df07f01a1ad53af"`,
    );
    await queryRunner.query(`DROP TABLE "procurement_requisition_attachments"`);
    await queryRunner.query(`DROP TABLE "procurement_requisitions"`);
    await queryRunner.query(`DROP TABLE "procurement_requisition_activities"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan"`);
    await queryRunner.query(`DROP TABLE "post_budget_plan_activities"`);
  }
}

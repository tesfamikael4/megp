import { MigrationInterface, QueryRunner } from 'typeorm';

export class WorkflowItems1720095835212 implements MigrationInterface {
  name = 'WorkflowItems1720095835212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."workflow_item_details_status_enum" AS ENUM('APPROVE', 'ADJUST', 'REJECT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow_item_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "status" "public"."workflow_item_details_status_enum" NOT NULL, "remark" character varying, "workflowItemId" uuid NOT NULL, CONSTRAINT "PK_6a6e78dfcb76b5b5afab831430e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "approverId" uuid NOT NULL, "objectId" uuid NOT NULL, "isComplete" boolean NOT NULL DEFAULT false, "isCurrent" boolean NOT NULL DEFAULT true, "version" integer NOT NULL, "step" integer NOT NULL, CONSTRAINT "PK_dfa7ba31d57bce22d110cb22708" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_item_details" ADD CONSTRAINT "FK_f84af02a689be871ecae37c9ba7" FOREIGN KEY ("workflowItemId") REFERENCES "workflow_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_item_details" DROP CONSTRAINT "FK_f84af02a689be871ecae37c9ba7"`,
    );
    await queryRunner.query(`DROP TABLE "workflow_items"`);
    await queryRunner.query(`DROP TABLE "workflow_item_details"`);
    await queryRunner.query(
      `DROP TYPE "public"."workflow_item_details_status_enum"`,
    );
  }
}

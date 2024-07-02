import { MigrationInterface, QueryRunner } from 'typeorm';

export class EvalApproval1719904378841 implements MigrationInterface {
  name = 'EvalApproval1719904378841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "eval_approvals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "evaluatorId" uuid NOT NULL, "evaluatorName" character varying NOT NULL, "order" integer NOT NULL, "version" integer NOT NULL DEFAULT '0', "isCurrent" boolean NOT NULL DEFAULT true, "isDone" boolean NOT NULL DEFAULT false, "rfxId" uuid NOT NULL, CONSTRAINT "PK_fd4436c8da07d9a5534b2f24e06" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eval_approval_details_status_enum" AS ENUM('APPROVED', 'REJECTED', 'ADJUST')`,
    );
    await queryRunner.query(
      `CREATE TABLE "eval_approval_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "evalApprovalId" uuid NOT NULL, "rfxItemId" uuid NOT NULL, "status" "public"."eval_approval_details_status_enum" NOT NULL, "remark" character varying, CONSTRAINT "PK_76481cae7ede8c1d0bb01ee79fa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_approvals" ADD CONSTRAINT "FK_a5659b860393d9ae8d9d06964d1" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_approval_details" ADD CONSTRAINT "FK_6219cd3bcb11ef90f1c4f480b12" FOREIGN KEY ("evalApprovalId") REFERENCES "eval_approvals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_approval_details" ADD CONSTRAINT "FK_cd58f163f6bcfe922e07ae606c1" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eval_approval_details" DROP CONSTRAINT "FK_cd58f163f6bcfe922e07ae606c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_approval_details" DROP CONSTRAINT "FK_6219cd3bcb11ef90f1c4f480b12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_approvals" DROP CONSTRAINT "FK_a5659b860393d9ae8d9d06964d1"`,
    );
    await queryRunner.query(`DROP TABLE "eval_approval_details"`);
    await queryRunner.query(
      `DROP TYPE "public"."eval_approval_details_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "eval_approvals"`);
  }
}

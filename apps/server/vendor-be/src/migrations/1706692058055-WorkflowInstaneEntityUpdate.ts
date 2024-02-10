import { MigrationInterface, QueryRunner } from 'typeorm';

export class WorkflowInstaneEntityUpdate1706692058055
  implements MigrationInterface
{
  name = 'WorkflowInstaneEntityUpdate1706692058055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_instances" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_instances" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_instances" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_instances" ADD "deletedAt" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_instances" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_instances" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_instances" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_instances" DROP COLUMN "tenantId"`,
    );
  }
}

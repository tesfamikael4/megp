import { MigrationInterface, QueryRunner } from 'typeorm';

export class WorkflowApplication1715061748122 implements MigrationInterface {
  name = 'WorkflowApplication1715061748122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "workflowId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_8031d136fb2c73a8dbc10341ef1" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_8031d136fb2c73a8dbc10341ef1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP COLUMN "workflowId"`,
    );
  }
}

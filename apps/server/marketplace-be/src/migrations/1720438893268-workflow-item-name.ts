import { MigrationInterface, QueryRunner } from 'typeorm';

export class WorkflowItemName1720438893268 implements MigrationInterface {
  name = 'WorkflowItemName1720438893268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_items" ADD "approverName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" DROP CONSTRAINT "FK_f290cd31c318c33b11a70d5ad98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" DROP CONSTRAINT "REL_f290cd31c318c33b11a70d5ad9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ADD CONSTRAINT "FK_f290cd31c318c33b11a70d5ad98" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_items" DROP COLUMN "approverName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" DROP CONSTRAINT "FK_f290cd31c318c33b11a70d5ad98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ADD CONSTRAINT "REL_f290cd31c318c33b11a70d5ad9" UNIQUE ("rfxItemId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ADD CONSTRAINT "FK_f290cd31c318c33b11a70d5ad98" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

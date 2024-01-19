import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUOMPost1705676029432 implements MigrationInterface {
  name = 'RemoveUOMPost1705676029432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" RENAME COLUMN "uom" TO "uomName"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" RENAME COLUMN "uomName" TO "uom"`,
    );
  }
}

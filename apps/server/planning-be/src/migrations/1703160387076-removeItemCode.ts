import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveItemCode1703160387076 implements MigrationInterface {
  name = 'RemoveItemCode1703160387076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" DROP COLUMN "itemCodeReferenceType"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_items" ADD "itemCodeReferenceType" character varying NOT NULL`,
    );
  }
}

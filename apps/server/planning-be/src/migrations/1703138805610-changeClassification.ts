import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeClassification1703138805610 implements MigrationInterface {
  name = 'ChangeClassification1703138805610';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD "budget_year" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "UQ_09180d611e035643f5788d385ff" UNIQUE ("budget_year")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "classification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "classification" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" ADD CONSTRAINT "FK_09180d611e035643f5788d385ff" FOREIGN KEY ("budget_year") REFERENCES "budget_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "FK_09180d611e035643f5788d385ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" DROP COLUMN "classification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_plan_activities" ADD "classification" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP CONSTRAINT "UQ_09180d611e035643f5788d385ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_plan_disbursements" DROP COLUMN "budget_year"`,
    );
  }
}

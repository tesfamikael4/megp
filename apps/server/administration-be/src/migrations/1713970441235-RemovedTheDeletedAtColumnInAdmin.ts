import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedTheDeletedAtColumnInAdmin1713970441235
  implements MigrationInterface
{
  name = 'RemovedTheDeletedAtColumnInAdmin1713970441235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "classifications" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxonomy_code_sets" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "measurements" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_categories" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "item_meta_data" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_of_measurements" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target_groups" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "districts" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "regions" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "procurement_thresholds" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_categories" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_budget_category" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "tax_payers" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "ncic_vendors" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_sub_categories" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "donors" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "customer_bussines_infos" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "currencies" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "clarification_requests" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clarification_response" DROP COLUMN "deletedAt"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clarification_response" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "clarification_requests" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "currencies" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_bussines_infos" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "donors" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "fppa_vendors_infos" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_releases" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_forfeits" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_sub_categories" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "ncic_vendors" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "tax_payers" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_budget_category" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_categories" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_thresholds" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "regions" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "districts" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "target_groups" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_of_measurements" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_meta_data" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "tags" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "item_categories" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "measurements" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "taxonomy_code_sets" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "classifications" ADD "deletedAt" TIMESTAMP`,
    );
  }
}

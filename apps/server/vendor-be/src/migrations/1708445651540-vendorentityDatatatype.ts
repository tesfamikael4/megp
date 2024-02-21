import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendorentityDatatatype1708445651540 implements MigrationInterface {
  name = 'VendorentityDatatatype1708445651540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "banks" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "banks" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "banks" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "banks" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "custom_categories" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_categories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_categories" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_categories" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_categories" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_categories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_categories" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_categories" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_areas" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_areas" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_areas" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_areas" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_handlers" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_handlers" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_handlers" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_handlers" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "task_trackers" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_trackers" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_trackers" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_trackers" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_info" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_info" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_info" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_info" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_types" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_types" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_types" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_types" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "receipts" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "receipts" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "receipts" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "receipts" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "receipts" DROP COLUMN "tenantId"`);
    await queryRunner.query(`ALTER TABLE "task_types" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "task_types" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "task_types" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "task_types" DROP COLUMN "tenantId"`);
    await queryRunner.query(
      `ALTER TABLE "profile_info" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_info" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_info" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_info" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_trackers" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_trackers" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_trackers" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_trackers" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "tenantId"`);
    await queryRunner.query(
      `ALTER TABLE "task_handlers" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_handlers" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_handlers" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_handlers" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_areas" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_areas" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_areas" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_areas" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_interest_area" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_categories" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_categories" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_categories" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_categories" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "tenantId"`);
    await queryRunner.query(
      `ALTER TABLE "custom_categories" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_categories" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_categories" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_categories" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(`ALTER TABLE "banks" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "banks" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "banks" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "banks" DROP COLUMN "tenantId"`);
  }
}

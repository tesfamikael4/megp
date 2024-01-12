import { MigrationInterface, QueryRunner } from 'typeorm';

export class OnOrganizationAndRoleEntity1705067698670
  implements MigrationInterface
{
  name = 'OnOrganizationAndRoleEntity1705067698670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization_budget_category" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "organizationId" character varying NOT NULL, "budgetCategoryId" uuid NOT NULL, CONSTRAINT "PK_c02348c2d342798178d97cba9e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "measurements" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_budget_category" ADD CONSTRAINT "FK_738f5c22c60a80a2d5767d2740f" FOREIGN KEY ("budgetCategoryId") REFERENCES "budget_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_budget_category" DROP CONSTRAINT "FK_738f5c22c60a80a2d5767d2740f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "measurements" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "organization_budget_category"`);
  }
}

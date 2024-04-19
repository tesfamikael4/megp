import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItemSubCategory1713189874201 implements MigrationInterface {
  name = 'ItemSubCategory1713189874201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."item_sub_categories_parentcategories_enum" AS ENUM('Goods', 'Service', 'Work')`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_sub_categories" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "parentCategories" "public"."item_sub_categories_parentcategories_enum" NOT NULL, CONSTRAINT "PK_84fb4062910e1ef3e67801df668" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item_sub_categories"`);
    await queryRunner.query(
      `DROP TYPE "public"."item_sub_categories_parentcategories_enum"`,
    );
  }
}

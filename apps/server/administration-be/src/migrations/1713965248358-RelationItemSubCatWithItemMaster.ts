import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelationItemSubCatWithItemMaster1713965248358
  implements MigrationInterface
{
  name = 'RelationItemSubCatWithItemMaster1713965248358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP CONSTRAINT "FK_a729dee3c492d6501e38ac2bead"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP COLUMN "itemSubcategoryName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP COLUMN "itemSubcategoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD "itemSubCategoryId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD "itemCategoryId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD CONSTRAINT "FK_a17a39fed6ea0e470200ea37642" FOREIGN KEY ("itemCategoryId") REFERENCES "item_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD CONSTRAINT "FK_1d9c7ce44c044453f84fffd774f" FOREIGN KEY ("itemSubCategoryId") REFERENCES "item_sub_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP CONSTRAINT "FK_1d9c7ce44c044453f84fffd774f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP CONSTRAINT "FK_a17a39fed6ea0e470200ea37642"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP COLUMN "itemCategoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP COLUMN "itemSubCategoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD "itemSubcategoryId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD "itemSubcategoryName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD CONSTRAINT "FK_a729dee3c492d6501e38ac2bead" FOREIGN KEY ("itemSubcategoryId") REFERENCES "item_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedColumnDecoratorToItemMaster1702904314705
  implements MigrationInterface
{
  name = 'AddedColumnDecoratorToItemMaster1702904314705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP CONSTRAINT "FK_a729dee3c492d6501e38ac2bead"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ALTER COLUMN "itemSubcategoryId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD CONSTRAINT "FK_a729dee3c492d6501e38ac2bead" FOREIGN KEY ("itemSubcategoryId") REFERENCES "item_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP CONSTRAINT "FK_a729dee3c492d6501e38ac2bead"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ALTER COLUMN "itemSubcategoryId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD CONSTRAINT "FK_a729dee3c492d6501e38ac2bead" FOREIGN KEY ("itemSubcategoryId") REFERENCES "item_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

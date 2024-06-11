import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableProductCatalogue1717587084253
  implements MigrationInterface
{
  name = 'NullableProductCatalogue1717587084253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ALTER COLUMN "productCatalogueId" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ALTER COLUMN "productCatalogueId" SET NOT NULL`,
    );
  }
}

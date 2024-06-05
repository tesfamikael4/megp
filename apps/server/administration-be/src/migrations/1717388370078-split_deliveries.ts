import { MigrationInterface, QueryRunner } from 'typeorm';

export class SplitDeliveries1717388370078 implements MigrationInterface {
  name = 'SplitDeliveries1717388370078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_catalog_deliveries" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deliverDays" integer NOT NULL, "location" character varying NOT NULL, "productCatalogId" uuid NOT NULL, "quantity" numeric(14,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_1819d7ed5e8054898c01d17b152" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" DROP COLUMN "deliveryValues"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalog_deliveries" ADD CONSTRAINT "FK_e73125aac93cfd4a27064847557" FOREIGN KEY ("productCatalogId") REFERENCES "product_catalogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_catalog_deliveries" DROP CONSTRAINT "FK_e73125aac93cfd4a27064847557"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" ADD "deliveryValues" jsonb NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "product_catalog_deliveries"`);
  }
}

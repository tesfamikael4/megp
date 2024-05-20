import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSpecsForPCat1716196053796 implements MigrationInterface {
    name = 'AddSpecsForPCat1716196053796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_catalogs" RENAME COLUMN "deletedAt" TO "specifications"`);
        await queryRunner.query(`ALTER TABLE "specification_templates" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "product_catalog_images" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "contract_allocated_items" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "contract_beneficiaries" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "contract_catalogs" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "contract_items" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "contract_item_prices" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "product_catalogs" DROP COLUMN "specifications"`);
        await queryRunner.query(`ALTER TABLE "product_catalogs" ADD "specifications" jsonb DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "contract_allocated_items" ALTER COLUMN "utilizedQuantity" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "contract_items" ALTER COLUMN "utilizedQuantity" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "contract_item_prices" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "contract_item_prices" ADD "location" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_item_prices" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "contract_item_prices" ADD "location" point NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_items" ALTER COLUMN "utilizedQuantity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contract_allocated_items" ALTER COLUMN "utilizedQuantity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_catalogs" DROP COLUMN "specifications"`);
        await queryRunner.query(`ALTER TABLE "product_catalogs" ADD "specifications" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contract_item_prices" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contract_items" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contract_catalogs" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contract_beneficiaries" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contract_allocated_items" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product_catalog_images" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "specification_templates" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product_catalogs" RENAME COLUMN "specifications" TO "deletedAt"`);
    }

}

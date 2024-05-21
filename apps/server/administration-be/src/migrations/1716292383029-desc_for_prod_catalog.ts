import { MigrationInterface, QueryRunner } from "typeorm";

export class DescForProdCatalog1716292383029 implements MigrationInterface {
    name = 'DescForProdCatalog1716292383029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_catalogs" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "specification_templates" ADD "itemMasterCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "specification_templates" DROP COLUMN "itemMasterCode"`);
        await queryRunner.query(`ALTER TABLE "product_catalogs" DROP COLUMN "description"`);
    }

}

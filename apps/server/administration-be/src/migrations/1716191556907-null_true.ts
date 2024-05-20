import { MigrationInterface, QueryRunner } from "typeorm";

export class NullTrue1716191556907 implements MigrationInterface {
    name = 'NullTrue1716191556907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_catalogs" ALTER COLUMN "specifications" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_catalogs" ALTER COLUMN "specifications" SET NOT NULL`);
    }

}

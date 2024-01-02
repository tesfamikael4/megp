import { MigrationInterface, QueryRunner } from "typeorm";

export class UniquenessIsUpdated1704183472030 implements MigrationInterface {
    name = 'UniquenessIsUpdated1704183472030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurements" RENAME COLUMN "shortName" TO "description"`);
        await queryRunner.query(`ALTER TABLE "measurements" RENAME CONSTRAINT "UQ_3883df5dc1cc11bf06655d3c67b" TO "UQ_17eb4e2764ca42df971346b2e6b"`);
        await queryRunner.query(`ALTER TABLE "unit_of_measurements" RENAME COLUMN "shortName" TO "abbreviation"`);
        await queryRunner.query(`ALTER TABLE "unit_of_measurements" RENAME CONSTRAINT "UQ_431f375e3bb7924c86acb7be152" TO "UQ_6ce0775c237142c61dda706b175"`);
        await queryRunner.query(`ALTER TABLE "currencies" ADD CONSTRAINT "UQ_976da6960ec4f0c96c26e3dffa0" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "currencies" ADD CONSTRAINT "UQ_b3fa69122703c1c6be7513d2eb6" UNIQUE ("abbreviation")`);
        await queryRunner.query(`ALTER TABLE "regions" ADD CONSTRAINT "UQ_1eb9a8899a7db89f6ba473fd847" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "UQ_6a6fd6d258022e5576afbad90b4" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "measurements" DROP CONSTRAINT "UQ_17eb4e2764ca42df971346b2e6b"`);
        await queryRunner.query(`ALTER TABLE "item_categories" ADD CONSTRAINT "UQ_88b385fb344dc44577a3f9e6a76" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "target_groups" ADD CONSTRAINT "UQ_bda34fd7cb9b5a0c1b15cbd8719" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target_groups" DROP CONSTRAINT "UQ_bda34fd7cb9b5a0c1b15cbd8719"`);
        await queryRunner.query(`ALTER TABLE "item_categories" DROP CONSTRAINT "UQ_88b385fb344dc44577a3f9e6a76"`);
        await queryRunner.query(`ALTER TABLE "measurements" ADD CONSTRAINT "UQ_17eb4e2764ca42df971346b2e6b" UNIQUE ("description")`);
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "UQ_6a6fd6d258022e5576afbad90b4"`);
        await queryRunner.query(`ALTER TABLE "regions" DROP CONSTRAINT "UQ_1eb9a8899a7db89f6ba473fd847"`);
        await queryRunner.query(`ALTER TABLE "currencies" DROP CONSTRAINT "UQ_b3fa69122703c1c6be7513d2eb6"`);
        await queryRunner.query(`ALTER TABLE "currencies" DROP CONSTRAINT "UQ_976da6960ec4f0c96c26e3dffa0"`);
        await queryRunner.query(`ALTER TABLE "unit_of_measurements" RENAME CONSTRAINT "UQ_6ce0775c237142c61dda706b175" TO "UQ_431f375e3bb7924c86acb7be152"`);
        await queryRunner.query(`ALTER TABLE "unit_of_measurements" RENAME COLUMN "abbreviation" TO "shortName"`);
        await queryRunner.query(`ALTER TABLE "measurements" RENAME CONSTRAINT "UQ_17eb4e2764ca42df971346b2e6b" TO "UQ_3883df5dc1cc11bf06655d3c67b"`);
        await queryRunner.query(`ALTER TABLE "measurements" RENAME COLUMN "description" TO "shortName"`);
    }

}

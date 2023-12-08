import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOnKeysOfApplicationAndPermission1701937068732 implements MigrationInterface {
    name = 'UpdateOnKeysOfApplicationAndPermission1701937068732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_017943867ed5ceef9c03edd9745" UNIQUE ("key")`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "UQ_5de0f110aed03277d8d7b2e5a89" UNIQUE ("key")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "UQ_5de0f110aed03277d8d7b2e5a89"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_017943867ed5ceef9c03edd9745"`);
    }

}

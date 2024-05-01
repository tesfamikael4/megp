import { MigrationInterface, QueryRunner } from "typeorm";

export class VendorRegistrationDateNumberEntityChange1714561140119 implements MigrationInterface {
    name = 'VendorRegistrationDateNumberEntityChange1714561140119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendors" ADD "businessRegistrationNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD CONSTRAINT "UQ_a0a3a79de0c40776e07bd1196d9" UNIQUE ("businessRegistrationNumber")`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD "registrationIssuedDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "registrationIssuedDate"`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP CONSTRAINT "UQ_a0a3a79de0c40776e07bd1196d9"`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "businessRegistrationNumber"`);
    }

}

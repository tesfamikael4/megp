import { MigrationInterface, QueryRunner } from "typeorm";

export class BusinessInterstAreaEntityChange1719314691897 implements MigrationInterface {
    name = 'BusinessInterstAreaEntityChange1719314691897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business_interest_area" ADD "registrationDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "business_interest_area" ADD "registrationNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "business_interest_area" DROP COLUMN "activationDate"`);
        await queryRunner.query(`ALTER TABLE "business_interest_area" ADD "activationDate" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business_interest_area" DROP COLUMN "activationDate"`);
        await queryRunner.query(`ALTER TABLE "business_interest_area" ADD "activationDate" date`);
        await queryRunner.query(`ALTER TABLE "business_interest_area" DROP COLUMN "registrationNumber"`);
        await queryRunner.query(`ALTER TABLE "business_interest_area" DROP COLUMN "registrationDate"`);

    }

}

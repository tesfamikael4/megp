import { MigrationInterface, QueryRunner } from "typeorm";

export class BuinessAreaeEntity1702555828886 implements MigrationInterface {
    name = 'BuinessAreaeEntity1702555828886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business_areas" DROP CONSTRAINT "FK_638c694a2ec10938c02b13a32d8"`);
        await queryRunner.query(`ALTER TABLE "business_areas" ALTER COLUMN "priceRangeId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "business_areas" ADD CONSTRAINT "FK_638c694a2ec10938c02b13a32d8" FOREIGN KEY ("priceRangeId") REFERENCES "service_pricing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business_areas" DROP CONSTRAINT "FK_638c694a2ec10938c02b13a32d8"`);
        await queryRunner.query(`ALTER TABLE "business_areas" ALTER COLUMN "priceRangeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "business_areas" ADD CONSTRAINT "FK_638c694a2ec10938c02b13a32d8" FOREIGN KEY ("priceRangeId") REFERENCES "service_pricing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

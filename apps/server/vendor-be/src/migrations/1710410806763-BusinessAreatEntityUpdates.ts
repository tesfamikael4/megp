import { MigrationInterface, QueryRunner } from "typeorm";

export class BusinessAreatEntityUpdates1710410806763 implements MigrationInterface {
    name = 'BusinessAreatEntityUpdates1710410806763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business_areas" ALTER COLUMN "instanceId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business_areas" ALTER COLUMN "instanceId" SET NOT NULL`);
    }

}

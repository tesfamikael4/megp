import { MigrationInterface, QueryRunner } from "typeorm";

export class SRVendorEntityUpdates1710416932711 implements MigrationInterface {
    name = 'SRVendorEntityUpdates1710416932711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "isr_vendors" ADD "lineOfBusiness" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "isr_vendors" DROP COLUMN "lineOfBusiness"`);
    }

}

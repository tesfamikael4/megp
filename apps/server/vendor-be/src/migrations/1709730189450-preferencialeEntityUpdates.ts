import { MigrationInterface, QueryRunner } from "typeorm";

export class PreferencialeEntityUpdates1709730189450 implements MigrationInterface {
    name = 'PreferencialeEntityUpdates1709730189450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "preferential_treatments" DROP COLUMN "extendedProfile"`);
        await queryRunner.query(`ALTER TABLE "preferential_treatments" DROP COLUMN "otherDocuments"`);
        await queryRunner.query(`ALTER TABLE "preferential_treatments" DROP COLUMN "remark"`);
        await queryRunner.query(`ALTER TABLE "preferential_treatments" ALTER COLUMN "certificateUrl" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "preferential_treatments" ALTER COLUMN "certificateUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "preferential_treatments" ADD "remark" character varying`);
        await queryRunner.query(`ALTER TABLE "preferential_treatments" ADD "otherDocuments" jsonb`);
        await queryRunner.query(`ALTER TABLE "preferential_treatments" ADD "extendedProfile" jsonb`);
    }

}

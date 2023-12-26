import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationsStatusEntity1703577242807 implements MigrationInterface {
    name = 'NotificationsStatusEntity1703577242807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business_areas" ADD "businessAreaState" jsonb NOT NULL DEFAULT '{"status":"Draft","level":"info"}'`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "status" SET DEFAULT 'new'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business_areas" DROP COLUMN "businessAreaState"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "status" DROP DEFAULT`);

    }

}

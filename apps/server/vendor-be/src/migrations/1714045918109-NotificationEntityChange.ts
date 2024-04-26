import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationEntityChange1714045918109 implements MigrationInterface {
    name = 'NotificationEntityChange1714045918109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "category" character varying NOT NULL DEFAULT 'Activity_Notification'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "category"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceEntityUpdate1709188990582 implements MigrationInterface {
    name = 'InvoiceEntityUpdate1709188990582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" RENAME COLUMN "serviceName" TO "paymentDetail"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "paymentDetail"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "paymentDetail" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "paymentDetail"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "paymentDetail" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" RENAME COLUMN "paymentDetail" TO "serviceName"`);
    }

}

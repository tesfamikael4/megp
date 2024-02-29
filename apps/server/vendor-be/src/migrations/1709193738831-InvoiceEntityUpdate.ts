import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceEntityUpdate1709193738831 implements MigrationInterface {
    name = 'InvoiceEntityUpdate1709193738831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "paymentDetail" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "paymentDetail" SET DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "paymentDetail" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "paymentDetail" SET NOT NULL`);
    }

}

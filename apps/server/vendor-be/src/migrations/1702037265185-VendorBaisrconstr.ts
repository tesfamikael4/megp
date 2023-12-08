import { MigrationInterface, QueryRunner } from "typeorm";

export class VendorBaisrconstr1702037265185 implements MigrationInterface {
    name = 'VendorBaisrconstr1702037265185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banks" ALTER COLUMN "bankName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "isr_vendors" ADD CONSTRAINT "UQ_5b926a7c29cb4b0a8e68310c2cf" UNIQUE ("vendorId")`);
        await queryRunner.query(`ALTER TABLE "business_areas" ADD CONSTRAINT "UQ_0a42b8b23269976189d825a5e86" UNIQUE ("serviceId")`);
        await queryRunner.query(`ALTER TABLE "bp_services" ADD CONSTRAINT "UQ_c6d5174331e8d9a448333360cb3" UNIQUE ("businessAreaId")`);
        await queryRunner.query(`ALTER TABLE "isr_vendors" ADD CONSTRAINT "FK_5b926a7c29cb4b0a8e68310c2cf" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "business_areas" ADD CONSTRAINT "FK_0a42b8b23269976189d825a5e86" FOREIGN KEY ("serviceId") REFERENCES "bp_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bp_services" ADD CONSTRAINT "FK_c6d5174331e8d9a448333360cb3" FOREIGN KEY ("businessAreaId") REFERENCES "business_areas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bp_services" DROP CONSTRAINT "FK_c6d5174331e8d9a448333360cb3"`);
        await queryRunner.query(`ALTER TABLE "business_areas" DROP CONSTRAINT "FK_0a42b8b23269976189d825a5e86"`);
        await queryRunner.query(`ALTER TABLE "isr_vendors" DROP CONSTRAINT "FK_5b926a7c29cb4b0a8e68310c2cf"`);
        await queryRunner.query(`ALTER TABLE "bp_services" DROP CONSTRAINT "UQ_c6d5174331e8d9a448333360cb3"`);
        await queryRunner.query(`ALTER TABLE "business_areas" DROP CONSTRAINT "UQ_0a42b8b23269976189d825a5e86"`);
        await queryRunner.query(`ALTER TABLE "isr_vendors" DROP CONSTRAINT "UQ_5b926a7c29cb4b0a8e68310c2cf"`);
        await queryRunner.query(`ALTER TABLE "banks" ALTER COLUMN "bankName" SET NOT NULL`);
    }

}

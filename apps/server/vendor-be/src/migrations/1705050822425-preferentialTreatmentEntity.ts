import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreferentialTreatmentEntity1705050822425
  implements MigrationInterface
{
  name = 'PreferentialTreatmentEntity1705050822425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "preferential_treatments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" uuid NOT NULL, "serviceId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'Submitted', "remark" character varying, "extendedProfile" jsonb, "attachments" jsonb, CONSTRAINT "PK_546ce1c56b7abaffd2af72ae511" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD CONSTRAINT "FK_00b3a22df6dc5ecdfedc9fa4521" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD CONSTRAINT "FK_7dcf57261b1ad60b4ef0396ddc5" FOREIGN KEY ("serviceId") REFERENCES "bp_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP CONSTRAINT "FK_7dcf57261b1ad60b4ef0396ddc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP CONSTRAINT "FK_00b3a22df6dc5ecdfedc9fa4521"`,
    );
    await queryRunner.query(`DROP TABLE "preferential_treatments"`);
  }
}

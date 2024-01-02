import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendorProfileInfoEntityAdded1704137135034
  implements MigrationInterface
{
  name = 'VendorProfileInfoEntityAdded1704137135034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profileData" jsonb array NOT NULL, "status" character varying NOT NULL, "vendorId" uuid NOT NULL, CONSTRAINT "PK_cc5d6053f46d871ae09ce7a2fa6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_info" ADD CONSTRAINT "FK_4b910b0a95f1297d540592ac59c" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile_info" DROP CONSTRAINT "FK_4b910b0a95f1297d540592ac59c"`,
    );
    await queryRunner.query(`DROP TABLE "profile_info"`);
  }
}

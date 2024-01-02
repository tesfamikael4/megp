import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendorupdateInfoNew1704151508707 implements MigrationInterface {
  name = 'VendorupdateInfoNew1704151508707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile_info" ALTER COLUMN "profileData" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile_info" ALTER COLUMN "profileData" DROP NOT NULL`,
    );
  }
}

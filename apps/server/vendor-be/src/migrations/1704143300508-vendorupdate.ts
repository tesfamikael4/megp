import { MigrationInterface, QueryRunner } from 'typeorm';

export class Vendorupdate1704143300508 implements MigrationInterface {
  name = 'Vendorupdate1704143300508';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile_info" DROP COLUMN "profileData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_info" ADD "profileData" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile_info" DROP COLUMN "profileData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_info" ADD "profileData" jsonb array NOT NULL`,
    );
  }
}

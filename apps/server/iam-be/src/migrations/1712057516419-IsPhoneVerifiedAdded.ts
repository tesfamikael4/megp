import { MigrationInterface, QueryRunner } from 'typeorm';

export class IsPhoneVerifiedAdded1712057516419 implements MigrationInterface {
  name = 'IsPhoneVerifiedAdded1712057516419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "isPhoneVerified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP COLUMN "isPhoneVerified"`,
    );
  }
}

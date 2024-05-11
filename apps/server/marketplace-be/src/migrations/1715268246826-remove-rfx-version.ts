import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRfxVersion1715268246826 implements MigrationInterface {
  name = 'RemoveRfxVersion1715268246826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rfxs" DROP COLUMN "version"`);
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT 'false'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ADD "version" integer NOT NULL DEFAULT '1'`,
    );
  }
}

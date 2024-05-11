import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableInvitationDate1715342785908 implements MigrationInterface {
  name = 'NullableInvitationDate1715342785908';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "invitationDate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT 'false'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "invitationDate" SET NOT NULL`,
    );
  }
}

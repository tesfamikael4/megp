import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidSecurity1712931616212 implements MigrationInterface {
  name = 'UpdateOnBidSecurity1712931616212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" ADD CONSTRAINT "UQ_e017f289ff39dd77d2a1148c2a5" UNIQUE ("lotId", "bidSecurityForm")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" DROP CONSTRAINT "UQ_e017f289ff39dd77d2a1148c2a5"`,
    );
  }
}

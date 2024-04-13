import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidSecurityEntity1713004693872
  implements MigrationInterface
{
  name = 'UpdateOnBidSecurityEntity1713004693872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" DROP CONSTRAINT "UQ_e017f289ff39dd77d2a1148c2a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" DROP CONSTRAINT "FK_f74f982a3d5a91345ea8fd96865"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" ADD CONSTRAINT "UQ_f74f982a3d5a91345ea8fd96865" UNIQUE ("lotId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" ADD CONSTRAINT "FK_f74f982a3d5a91345ea8fd96865" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" DROP CONSTRAINT "FK_f74f982a3d5a91345ea8fd96865"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" DROP CONSTRAINT "UQ_f74f982a3d5a91345ea8fd96865"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" ADD CONSTRAINT "FK_f74f982a3d5a91345ea8fd96865" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" ADD CONSTRAINT "UQ_e017f289ff39dd77d2a1148c2a5" UNIQUE ("lotId", "bidSecurityForm")`,
    );
  }
}

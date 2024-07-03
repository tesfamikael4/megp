import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderEntity1719997608596 implements MigrationInterface {
  name = 'UpdateOnTenderEntity1719997608596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "procurementCategory" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "procurementReferenceNumber" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD CONSTRAINT "UQ_090c132c0467a70922cb4214a8c" UNIQUE ("procurementReferenceNumber")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD CONSTRAINT "UQ_ad826bdfb5fd63982167a240359" UNIQUE ("prId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" DROP CONSTRAINT "UQ_ad826bdfb5fd63982167a240359"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" DROP CONSTRAINT "UQ_090c132c0467a70922cb4214a8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "procurementReferenceNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "procurementCategory" DROP NOT NULL`,
    );
  }
}

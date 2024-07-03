import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProcuredBy1719856349844 implements MigrationInterface {
  name = 'ProcuredBy1719856349844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_procuredby_enum" AS ENUM('purchasing', 'auctioning')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ADD "procuredBy" "public"."rfxes_procuredby_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ADD "calculatedAmount" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "deltaPercentage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "deltaPercentage" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "deltaPercentage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "deltaPercentage" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" DROP COLUMN "calculatedAmount"`,
    );
    await queryRunner.query(`ALTER TABLE "rfxes" DROP COLUMN "procuredBy"`);
    await queryRunner.query(`DROP TYPE "public"."rfxes_procuredby_enum"`);
  }
}

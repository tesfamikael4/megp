import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableRankOnOpenedOffer1717677278320
  implements MigrationInterface
{
  name = 'NullableRankOnOpenedOffer1717677278320';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "opened_offers" ADD "rank" integer`);
    await queryRunner.query(
      `ALTER TYPE "public"."rfxes_status_enum" RENAME TO "rfxes_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'SUBMITTED_EVALUATION', 'APPROVED', 'REJECTED', 'CANCELLED', 'EVALUATION', 'EVALUATION_REJECTED', 'AUCTION', 'ENDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" TYPE "public"."rfxes_status_enum" USING "status"::"text"::"public"."rfxes_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rfxes_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum_old" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'SUBMITTED_EVALUATION', 'APPROVED', 'REJECTED', 'CANCELLED', 'EVALUATION', 'AUCTION', 'ENDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" TYPE "public"."rfxes_status_enum_old" USING "status"::"text"::"public"."rfxes_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxes" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rfxes_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."rfxes_status_enum_old" RENAME TO "rfxes_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "opened_offers" DROP COLUMN "rank"`);
  }
}

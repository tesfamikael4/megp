import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidRegistrationEnumUpdated1710848960883
  implements MigrationInterface
{
  name = 'BidRegistrationEnumUpdated1710848960883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP COLUMN "envelopType"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bds_submissions_enveloptype_enum" AS ENUM('single envelop', 'two envelop')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD "envelopType" "public"."bds_submissions_enveloptype_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP COLUMN "envelopType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bds_submissions_enveloptype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD "envelopType" character varying NOT NULL`,
    );
  }
}

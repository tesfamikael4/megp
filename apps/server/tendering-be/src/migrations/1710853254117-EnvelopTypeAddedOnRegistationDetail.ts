import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnvelopTypeAddedOnRegistationDetail1710853254117
  implements MigrationInterface
{
  name = 'EnvelopTypeAddedOnRegistationDetail1710853254117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bid_registration_details_enveloptype_enum" AS ENUM('single envelop', 'two envelop')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD "envelopType" "public"."bid_registration_details_enveloptype_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP COLUMN "envelopType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bid_registration_details_enveloptype_enum"`,
    );
  }
}

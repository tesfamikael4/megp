import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderStatusCanceled1716885265425
  implements MigrationInterface
{
  name = 'UpdateOnTenderStatusCanceled1716885265425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."items_status_enum" RENAME TO "items_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."items_status_enum" AS ENUM('ACTIVE', 'CANCELED', 'RE_ADVERTISE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "status" TYPE "public"."items_status_enum" USING "status"::"text"::"public"."items_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(`DROP TYPE "public"."items_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."lots_status_enum" RENAME TO "lots_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."lots_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'CANCELED', 'RE_ADVERTISE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "status" TYPE "public"."lots_status_enum" USING "status"::"text"::"public"."lots_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."lots_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."lots_status_enum_old" AS ENUM('ACTIVE', 'DRAFT', 'RE_ADVERTISE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "status" TYPE "public"."lots_status_enum_old" USING "status"::"text"::"public"."lots_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."lots_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."lots_status_enum_old" RENAME TO "lots_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."items_status_enum_old" AS ENUM('ACTIVE', 'RE_ADVERTISE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "status" TYPE "public"."items_status_enum_old" USING "status"::"text"::"public"."items_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(`DROP TYPE "public"."items_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."items_status_enum_old" RENAME TO "items_status_enum"`,
    );
  }
}

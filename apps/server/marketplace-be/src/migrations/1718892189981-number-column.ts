import { MigrationInterface, QueryRunner } from 'typeorm';

export class NumberColumn1718892189981 implements MigrationInterface {
  name = 'NumberColumn1718892189981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "opened_offers" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD "price" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "opened_offers" DROP COLUMN "tax"`);
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD "tax" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_items_status_enum" RENAME TO "rfx_items_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_items_status_enum" AS ENUM('DRAFT', 'PENDING', 'INVITATION_PREPARED', 'SUBMITTED', 'APPROVED', 'COMPLETED', 'REJECTED', 'ENDED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" TYPE "public"."rfx_items_status_enum" USING "status"::"text"::"public"."rfx_items_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rfx_items_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_items_status_enum_old" AS ENUM('DRAFT', 'PENDING', 'INVITATION_PREPARED', 'SUBMITTED', 'APPROVED', 'COMPLETED', 'REJECTED', 'ENDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" TYPE "public"."rfx_items_status_enum_old" USING "status"::"text"::"public"."rfx_items_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_items" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rfx_items_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."rfx_items_status_enum_old" RENAME TO "rfx_items_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "opened_offers" DROP COLUMN "tax"`);
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD "tax" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "opened_offers" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD "price" integer NOT NULL`,
    );
  }
}

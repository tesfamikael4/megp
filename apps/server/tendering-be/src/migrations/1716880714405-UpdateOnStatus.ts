import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnStatus1716880714405 implements MigrationInterface {
  name = 'UpdateOnStatus1716880714405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."items_status_enum" AS ENUM('ACTIVE', 'RE_ADVERTISE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD "status" "public"."items_status_enum" NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(`ALTER TABLE "lots" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."lots_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'RE_ADVERTISE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ADD "status" "public"."lots_status_enum" NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`ALTER TABLE "tenders" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."tenders_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'SUBMISSION', 'APPROVAL', 'PUBLISHED', 'CANCELED', 'RE_ADVERTISE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD "status" "public"."tenders_status_enum" NOT NULL DEFAULT 'DRAFT'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tenders" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."tenders_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "lots" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."lots_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "lots" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."items_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "items" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`,
    );
  }
}

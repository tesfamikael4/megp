import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderStatus1716883831904 implements MigrationInterface {
  name = 'UpdateOnTenderStatus1716883831904';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."tenders_status_enum" RENAME TO "tenders_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tenders_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'SUBMISSION', 'APPROVAL', 'PUBLISHED', 'ADJUSTED', 'CANCELED', 'RE_ADVERTISE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "status" TYPE "public"."tenders_status_enum" USING "status"::"text"::"public"."tenders_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."tenders_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tenders_status_enum_old" AS ENUM('APPROVAL', 'CANCELED', 'DRAFT', 'PUBLISHED', 'RE_ADVERTISE', 'SUBMISSION', 'SUBMITTED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "status" TYPE "public"."tenders_status_enum_old" USING "status"::"text"::"public"."tenders_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."tenders_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."tenders_status_enum_old" RENAME TO "tenders_status_enum"`,
    );
  }
}

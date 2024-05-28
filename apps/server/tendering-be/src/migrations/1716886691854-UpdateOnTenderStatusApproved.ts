import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderStatusApproved1716886691854
  implements MigrationInterface
{
  name = 'UpdateOnTenderStatusApproved1716886691854';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."items_status_enum" RENAME TO "items_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."items_status_enum" AS ENUM('ACTIVE', 'CANCELED', 'RE-ADVERTISED')`,
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
      `CREATE TYPE "public"."lots_status_enum" AS ENUM('ACTIVE', 'CANCELED', 'RE-ADVERTISED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "status" TYPE "public"."lots_status_enum" USING "status"::"text"::"public"."lots_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(`DROP TYPE "public"."lots_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."tenders_status_enum" RENAME TO "tenders_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tenders_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'SENT_FOR_REVIEW', 'REVIEWED', 'APPROVAL', 'APPROVED', 'PUBLISHED', 'ADJUSTED', 'CANCELED', 'RE-ADVERTISED')`,
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
    await queryRunner.query(
      `ALTER TABLE "revision_approvals" ADD CONSTRAINT "UQ_92ff2f55e29419ccad038e05121" UNIQUE ("tenderId", "userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "revision_approvals" DROP CONSTRAINT "UQ_92ff2f55e29419ccad038e05121"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tenders_status_enum_old" AS ENUM('ADJUSTED', 'APPROVAL', 'CANCELED', 'DRAFT', 'PUBLISHED', 'RE_ADVERTISE', 'SUBMISSION', 'SUBMITTED')`,
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

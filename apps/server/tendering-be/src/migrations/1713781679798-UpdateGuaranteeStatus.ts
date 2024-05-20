import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGuaranteeStatus1713781679798 implements MigrationInterface {
  name = 'UpdateGuaranteeStatus1713781679798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."bid_guarantees_status_enum" RENAME TO "bid_guarantees_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantees_status_enum" AS ENUM('DRAFT', 'REQUESTED', 'REVIEWED', 'REJECTED', 'VERIFIED', 'APPROVED', 'CANCELLED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" ALTER COLUMN "status" TYPE "public"."bid_guarantees_status_enum" USING "status"::"text"::"public"."bid_guarantees_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."bid_guarantees_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantees_status_enum_old" AS ENUM('DRAFT', 'REQUESTED', 'REVIEWED', 'REJECTED', 'VERIFIED', 'APPROVED', 'CANCELLED', 'EXPRIED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" ALTER COLUMN "status" TYPE "public"."bid_guarantees_status_enum_old" USING "status"::"text"::"public"."bid_guarantees_status_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."bid_guarantees_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."bid_guarantees_status_enum_old" RENAME TO "bid_guarantees_status_enum"`,
    );
  }
}

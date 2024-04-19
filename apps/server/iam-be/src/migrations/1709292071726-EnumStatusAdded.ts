import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnumStatusAdded1709292071726 implements MigrationInterface {
  name = 'EnumStatusAdded1709292071726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."users_status_enum" RENAME TO "users_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('DRAFT', 'PENDING', 'INVITED', 'INACTIVE', 'ACTIVE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "status" TYPE "public"."users_status_enum" USING "status"::"text"::"public"."users_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum_old" AS ENUM('DRAFT', 'PENDING', 'INACTIVE', 'ACTIVE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "status" TYPE "public"."users_status_enum_old" USING "status"::"text"::"public"."users_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'INACTIVE'`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."users_status_enum_old" RENAME TO "users_status_enum"`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvitaitonRegistraion1717403630581 implements MigrationInterface {
  name = 'InvitaitonRegistraion1717403630581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ADD "solRegistrationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfxes_status_enum" RENAME TO "rfxes_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'SUBMITTED_EVALUATION', 'APPROVED', 'REJECTED', 'CANCELLED', 'EVALUATION', 'AUCTION', 'ENDED')`,
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
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" ADD CONSTRAINT "FK_6108633109a4e2bbf2da3f03b4a" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" DROP CONSTRAINT "FK_6108633109a4e2bbf2da3f03b4a"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum_old" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'SUBMITTED_EVALUATION', 'APPROVED', 'REJECTED', 'CANCELLED', 'EVALUATION', 'ENDED')`,
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
    await queryRunner.query(
      `ALTER TABLE "rfx_product_invitations" DROP COLUMN "solRegistrationId"`,
    );
  }
}

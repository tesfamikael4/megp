import { MigrationInterface, QueryRunner } from 'typeorm';

export class RfxRevisionApprovals1715256838801 implements MigrationInterface {
  name = 'RfxRevisionApprovals1715256838801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rfx_revision_approvals_status_enum" AS ENUM('APPROVED', 'APPROVED_WITH_COMMENT', 'ADJUST_WITH_COMMENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rfx_revision_approvals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "userId" uuid NOT NULL, "status" "public"."rfx_revision_approvals_status_enum" NOT NULL DEFAULT 'APPROVED', CONSTRAINT "PK_0e4522493719035cdff87a5ae3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT 'false'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_revision_approvals" ADD CONSTRAINT "FK_87ecfc632e35405a06cc320b5d7" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_revision_approvals" DROP CONSTRAINT "FK_87ecfc632e35405a06cc320b5d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT false`,
    );
    await queryRunner.query(`DROP TABLE "rfx_revision_approvals"`);
    await queryRunner.query(
      `DROP TYPE "public"."rfx_revision_approvals_status_enum"`,
    );
  }
}

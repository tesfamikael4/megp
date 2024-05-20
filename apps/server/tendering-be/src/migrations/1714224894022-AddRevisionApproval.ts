import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRevisionApproval1714224894022 implements MigrationInterface {
  name = 'AddRevisionApproval1714224894022';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."revision_approvals_status_enum" AS ENUM('APPROVED', 'APPROVED_WITH_COMMENT', 'ADJUST_WITH_COMMENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "revision_approvals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "userId" uuid NOT NULL, "status" "public"."revision_approvals_status_enum" NOT NULL DEFAULT 'APPROVED', CONSTRAINT "PK_5062ab2aef8191d1cc7484580b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "revision_approvals" ADD CONSTRAINT "FK_39d625c9aff2b69ed302e5d0aab" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "revision_approvals" DROP CONSTRAINT "FK_39d625c9aff2b69ed302e5d0aab"`,
    );
    await queryRunner.query(`DROP TABLE "revision_approvals"`);
    await queryRunner.query(
      `DROP TYPE "public"."revision_approvals_status_enum"`,
    );
  }
}

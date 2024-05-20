import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidRegistration1710759369477
  implements MigrationInterface
{
  name = 'UpdateOnBidRegistration1710759369477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bid_registrations_status_enum" AS ENUM('PENDING', 'REGISTERED', 'SUBMITTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_registrations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "bidderId" character varying NOT NULL, "paymentInvoice" character varying, "paymentMethod" character varying, "payment" jsonb, "amount" numeric(10,2), "currency" character varying, "status" "public"."bid_registrations_status_enum" NOT NULL DEFAULT 'REGISTERED', CONSTRAINT "UQ_e6cf61c5edd3e8f14a93cbde6df" UNIQUE ("tenderId", "bidderId"), CONSTRAINT "PK_4ca0a2601f3b183fbe38890ae34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bid_bookmarks_status_enum" AS ENUM('BOOKMARKED', 'REGISTERED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_bookmarks" ADD "status" "public"."bid_bookmarks_status_enum" NOT NULL DEFAULT 'BOOKMARKED'`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP COLUMN "submissionDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD "submissionDeadline" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP COLUMN "openingDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD "openingDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP COLUMN "invitationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD "invitationDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" ADD CONSTRAINT "FK_29aed177e3aae66e39b0f933d8a" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registrations" DROP CONSTRAINT "FK_29aed177e3aae66e39b0f933d8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP COLUMN "invitationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD "invitationDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP COLUMN "openingDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD "openingDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP COLUMN "submissionDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD "submissionDeadline" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "bid_bookmarks" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."bid_bookmarks_status_enum"`);
    await queryRunner.query(`DROP TABLE "bid_registrations"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_registrations_status_enum"`,
    );
  }
}

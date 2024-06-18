import { MigrationInterface, QueryRunner } from 'typeorm';

export class Timestamptz1718717273741 implements MigrationInterface {
  name = 'Timestamptz1718717273741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "submissionDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "submissionDeadline" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "openingDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "openingDate" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "invitationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "invitationDate" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "reviewDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "reviewDeadline" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" DROP COLUMN "startingTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "startingTime" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" DROP COLUMN "endingTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "endingTime" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" DROP COLUMN "endingTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "endingTime" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" DROP COLUMN "startingTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "startingTime" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "reviewDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "reviewDeadline" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "invitationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "invitationDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "openingDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "openingDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "submissionDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "submissionDeadline" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD CONSTRAINT "CHK_67e53717b3ef9d87cc22ecfdda" CHECK (("submissionDeadline" > CURRENT_TIMESTAMP))`,
    );
  }
}

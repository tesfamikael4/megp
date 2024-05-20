import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidderComparison1715607250176 implements MigrationInterface {
  name = 'BidderComparison1715607250176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bidders-comparisons_milestone_enum" AS ENUM('100', '102', '104', '106', '108', '110', '112', '200', '201', '202', '203', '204', '205', '299', '300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '340', '360', '361', '362', '400', '401', '402', '500', '503', '505', '507', '600', '609', '612', '615', '9999', '9901')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bidders-comparisons" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationId" uuid NOT NULL, "itemId" character varying NOT NULL, "milestone" "public"."bidders-comparisons_milestone_enum" NOT NULL, "bidderStatus" character varying NOT NULL, "technicalPoints" character varying NOT NULL, "financialPoints" character varying NOT NULL, "isCurrent" boolean NOT NULL, "passFail" character varying NOT NULL, "version" character varying NOT NULL, CONSTRAINT "PK_30d8d983966b0640012fca0dc7b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" ADD CONSTRAINT "FK_d6e8aa1a7a8393aadcbbb30befb" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bidders-comparisons" DROP CONSTRAINT "FK_d6e8aa1a7a8393aadcbbb30befb"`,
    );
    await queryRunner.query(`DROP TABLE "bidders-comparisons"`);
    await queryRunner.query(
      `DROP TYPE "public"."bidders-comparisons_milestone_enum"`,
    );
  }
}

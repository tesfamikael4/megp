import { MigrationInterface, QueryRunner } from 'typeorm';

export class BidRegistrationDetailAdded1710837464991
  implements MigrationInterface
{
  name = 'BidRegistrationDetailAdded1710837464991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bid_registration_details_status_enum" AS ENUM('NOT_SUBMITTED', 'SUBMITTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_registration_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidRegistrationId" uuid NOT NULL, "lotId" uuid NOT NULL, "status" "public"."bid_registration_details_status_enum" NOT NULL DEFAULT 'NOT_SUBMITTED', CONSTRAINT "UQ_e8f0046094e3a07232d14c853ab" UNIQUE ("bidRegistrationId", "lotId"), CONSTRAINT "PK_4d167389b3f45777e23b17a6a77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD CONSTRAINT "FK_47b953f933f29ba577f5560f5f6" FOREIGN KEY ("bidRegistrationId") REFERENCES "bid_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" ADD CONSTRAINT "FK_9ecfd4427aa993439739b6b65e4" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP CONSTRAINT "FK_9ecfd4427aa993439739b6b65e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_registration_details" DROP CONSTRAINT "FK_47b953f933f29ba577f5560f5f6"`,
    );
    await queryRunner.query(`DROP TABLE "bid_registration_details"`);
    await queryRunner.query(
      `DROP TYPE "public"."bid_registration_details_status_enum"`,
    );
  }
}

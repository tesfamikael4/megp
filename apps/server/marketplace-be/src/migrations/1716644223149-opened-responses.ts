import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpenedResponses1716644223149 implements MigrationInterface {
  name = 'OpenedResponses1716644223149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfxs" DROP CONSTRAINT "CHK_18df1884946227fe421572e5c6"`,
    );
    await queryRunner.query(`ALTER TABLE "rfxs" DROP COLUMN "reviewDeadline"`);
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ADD "reviewDeadline" TIMESTAMP`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_responses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "key" character varying NOT NULL, "value" jsonb NOT NULL, "rfxId" uuid NOT NULL, "solResponseId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_1c7ce4673c77fe9a8c0d0b3a458" UNIQUE ("rfxId", "vendorId", "key"), CONSTRAINT "REL_5ebc337f03b2a1194db7baf0cd" UNIQUE ("solResponseId"), CONSTRAINT "PK_72394c2f73f61730415667101f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_response_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "key" character varying NOT NULL, "value" jsonb NOT NULL, "rfxItemId" uuid NOT NULL, "solItemResponseId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_ccc40594d56339a7b73f5dbba33" UNIQUE ("rfxItemId", "vendorId", "key"), CONSTRAINT "REL_e35d183419fde3a947576ea076" UNIQUE ("solItemResponseId"), CONSTRAINT "PK_7e7ac8d57e7f06cb13ba43bcce9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."opened_offers_status_enum" AS ENUM('PENDING', 'WINNER', 'NEXT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "opened_offers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" character varying NOT NULL, "price" integer NOT NULL, "status" "public"."opened_offers_status_enum" NOT NULL DEFAULT 'PENDING', "solRoundId" uuid NOT NULL, "rfxProductInvitationId" uuid NOT NULL, "rfxItemId" uuid NOT NULL, "solOfferId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_b3f7c350af861ad22f4775b70b7" UNIQUE ("rfxItemId", "vendorId", "solRoundId", "rfxProductInvitationId"), CONSTRAINT "REL_9678140a5fbfc9e80dd8ff2e54" UNIQUE ("solOfferId"), CONSTRAINT "PK_280297ae99aa7bcd003128e2295" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" ADD "solRegistrationId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD CONSTRAINT "FK_5ebc337f03b2a1194db7baf0cd5" FOREIGN KEY ("solResponseId") REFERENCES "sol_responses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD CONSTRAINT "FK_57c3860922e407a8a21fa6e761f" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD CONSTRAINT "FK_011a01ad28602c6c7b31c34ea3c" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" ADD CONSTRAINT "FK_f939ffd2c010af755fdc03238e7" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" ADD CONSTRAINT "FK_e35d183419fde3a947576ea0760" FOREIGN KEY ("solItemResponseId") REFERENCES "sol_response_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" ADD CONSTRAINT "FK_a1d66529e2f34ddcc4d6a3ca2da" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" ADD CONSTRAINT "FK_4aef63fad35f3f5692c680cc05a" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD CONSTRAINT "FK_054ec8fe170af7bd28c5403c020" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD CONSTRAINT "FK_9678140a5fbfc9e80dd8ff2e545" FOREIGN KEY ("solOfferId") REFERENCES "sol_offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD CONSTRAINT "FK_a363dc049ab5e91f689664a1bbc" FOREIGN KEY ("solRoundId") REFERENCES "sol_rounds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD CONSTRAINT "FK_9340c8eab9bdba29351e2b7c1f0" FOREIGN KEY ("rfxProductInvitationId") REFERENCES "rfx_product_invitations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" ADD CONSTRAINT "FK_36b79cffcef782c8cb41f1ff353" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP CONSTRAINT "FK_36b79cffcef782c8cb41f1ff353"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP CONSTRAINT "FK_9340c8eab9bdba29351e2b7c1f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP CONSTRAINT "FK_a363dc049ab5e91f689664a1bbc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP CONSTRAINT "FK_9678140a5fbfc9e80dd8ff2e545"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_offers" DROP CONSTRAINT "FK_054ec8fe170af7bd28c5403c020"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" DROP CONSTRAINT "FK_4aef63fad35f3f5692c680cc05a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" DROP CONSTRAINT "FK_a1d66529e2f34ddcc4d6a3ca2da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" DROP CONSTRAINT "FK_e35d183419fde3a947576ea0760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_response_items" DROP CONSTRAINT "FK_f939ffd2c010af755fdc03238e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP CONSTRAINT "FK_011a01ad28602c6c7b31c34ea3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP CONSTRAINT "FK_57c3860922e407a8a21fa6e761f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP CONSTRAINT "FK_5ebc337f03b2a1194db7baf0cd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_response_items" DROP COLUMN "solRegistrationId"`,
    );
    await queryRunner.query(`DROP TABLE "opened_offers"`);
    await queryRunner.query(`DROP TYPE "public"."opened_offers_status_enum"`);
    await queryRunner.query(`DROP TABLE "opened_response_items"`);
    await queryRunner.query(`DROP TABLE "opened_responses"`);
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" DROP COLUMN "reviewDeadline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ADD "reviewDeadline" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfxs" ADD CONSTRAINT "CHK_18df1884946227fe421572e5c6" CHECK (("reviewDeadline" > CURRENT_TIMESTAMP))`,
    );
  }
}

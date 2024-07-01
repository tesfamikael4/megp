import { MigrationInterface, QueryRunner } from 'typeorm';

export class Award1719592126043 implements MigrationInterface {
  name = 'Award1719592126043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."award_items_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "award_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" uuid NOT NULL, "vendorName" character varying NOT NULL, "calculatedPrice" numeric(14,2) NOT NULL DEFAULT '0', "status" "public"."award_items_status_enum" NOT NULL DEFAULT 'PENDING', "awardNoteId" uuid NOT NULL, "rfxItemId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, "openedOfferId" uuid NOT NULL, CONSTRAINT "REL_f290cd31c318c33b11a70d5ad9" UNIQUE ("rfxItemId"), CONSTRAINT "REL_f44728ad5e4c8131020c4db532" UNIQUE ("openedOfferId"), CONSTRAINT "PK_c9597973a2f519707b4c67c9cb1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "award_notes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfxId" uuid NOT NULL, "name" character varying NOT NULL, "procurementReferenceNumber" character varying, "description" character varying, "prId" character varying NOT NULL, "awardItemsId" uuid, CONSTRAINT "REL_61b43568839e7c08c7c5d12eaa" UNIQUE ("rfxId"), CONSTRAINT "PK_012a77e257cd41b4b666a70cfb3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ADD CONSTRAINT "FK_6f07163282c65d477cf39687102" FOREIGN KEY ("awardNoteId") REFERENCES "award_notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ADD CONSTRAINT "FK_f290cd31c318c33b11a70d5ad98" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ADD CONSTRAINT "FK_d4d7f60998386e8f5a584cb6a7d" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" ADD CONSTRAINT "FK_f44728ad5e4c8131020c4db5321" FOREIGN KEY ("openedOfferId") REFERENCES "opened_offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_notes" ADD CONSTRAINT "FK_61b43568839e7c08c7c5d12eaab" FOREIGN KEY ("rfxId") REFERENCES "rfxes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_notes" ADD CONSTRAINT "FK_756bbb6037f3e0930ad5f024b89" FOREIGN KEY ("awardItemsId") REFERENCES "award_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "award_notes" DROP CONSTRAINT "FK_756bbb6037f3e0930ad5f024b89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_notes" DROP CONSTRAINT "FK_61b43568839e7c08c7c5d12eaab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" DROP CONSTRAINT "FK_f44728ad5e4c8131020c4db5321"`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" DROP CONSTRAINT "FK_d4d7f60998386e8f5a584cb6a7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" DROP CONSTRAINT "FK_f290cd31c318c33b11a70d5ad98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "award_items" DROP CONSTRAINT "FK_6f07163282c65d477cf39687102"`,
    );
    await queryRunner.query(`DROP TABLE "award_notes"`);
    await queryRunner.query(`DROP TABLE "award_items"`);
    await queryRunner.query(`DROP TYPE "public"."award_items_status_enum"`);
  }
}

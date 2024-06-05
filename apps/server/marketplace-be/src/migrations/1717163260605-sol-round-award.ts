import { MigrationInterface, QueryRunner } from 'typeorm';

export class SolRoundAward1717163260605 implements MigrationInterface {
  name = 'SolRoundAward1717163260605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sol_round_awards" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "winnerPrice" numeric(10,2), "nextRoundStartingPrice" numeric(10,2), "rfxItemId" uuid NOT NULL, "solRoundId" uuid NOT NULL, "rfxProductInvitationId" uuid NOT NULL, "solOfferId" uuid NOT NULL, CONSTRAINT "UQ_890a1cc46db851d6560c96d84b4" UNIQUE ("rfxItemId", "solRoundId"), CONSTRAINT "REL_d743d73c267735bc3053b127b3" UNIQUE ("solOfferId"), CONSTRAINT "PK_14a5fb035b204773125dedf591b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" DROP COLUMN "startingPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD "hasEvaluated" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."rfxes_status_enum" RENAME TO "rfxes_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'SUBMITTED_EVALUATION', 'APPROVED', 'REJECTED', 'CANCELLED', 'EVALUATION', 'ENDED')`,
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
      `ALTER TABLE "opened_offers" ADD "tax" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD "encryptedTax" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ADD "openedOfferId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ADD CONSTRAINT "UQ_948efbab8c811d792c97bea4f19" UNIQUE ("openedOfferId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ADD CONSTRAINT "FK_948efbab8c811d792c97bea4f19" FOREIGN KEY ("openedOfferId") REFERENCES "opened_offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ADD CONSTRAINT "FK_0fe48b05f6c9da02c39747f8ecd" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ADD CONSTRAINT "FK_d88d5c61f3b45494ee52f72b922" FOREIGN KEY ("solRoundId") REFERENCES "sol_rounds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ADD CONSTRAINT "FK_3e34b2346d50a02ec4edd0b6e04" FOREIGN KEY ("rfxProductInvitationId") REFERENCES "rfx_product_invitations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" ADD CONSTRAINT "FK_d743d73c267735bc3053b127b30" FOREIGN KEY ("solOfferId") REFERENCES "sol_offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" DROP CONSTRAINT "FK_d743d73c267735bc3053b127b30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" DROP CONSTRAINT "FK_3e34b2346d50a02ec4edd0b6e04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" DROP CONSTRAINT "FK_d88d5c61f3b45494ee52f72b922"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" DROP CONSTRAINT "FK_0fe48b05f6c9da02c39747f8ecd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" DROP CONSTRAINT "FK_948efbab8c811d792c97bea4f19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" DROP CONSTRAINT "UQ_948efbab8c811d792c97bea4f19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_round_awards" DROP COLUMN "openedOfferId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP COLUMN "encryptedTax"`,
    );
    await queryRunner.query(`ALTER TABLE "opened_offers" DROP COLUMN "tax"`);
    await queryRunner.query(
      `CREATE TYPE "public"."rfxes_status_enum_old" AS ENUM('DRAFT', 'TEAM_REVIEWAL', 'ADJUSTEDMENT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ENDED')`,
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
      `ALTER TABLE "team_members" DROP COLUMN "hasEvaluated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD "startingPrice" numeric(10,2)`,
    );
    await queryRunner.query(`DROP TABLE "sol_round_awards"`);
  }
}

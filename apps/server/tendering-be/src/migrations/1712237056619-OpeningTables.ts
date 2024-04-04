import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpeningTables1712237056619 implements MigrationInterface {
  name = 'OpeningTables1712237056619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bid_opening_minutes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "remark" character varying, CONSTRAINT "PK_1ad73acb4a86c5d6582a79b8097" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid-securities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidSecurityType" character varying, "checked" boolean NOT NULL, "remark" character varying, "amount" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "isChecked" boolean NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_df90859429eca2e388b0af2ddfb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_opening_checklists" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "remark" character varying, CONSTRAINT "PK_277eec427ddffe68714c293e7f7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "openings" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "lotId" uuid NOT NULL, "openingType" text NOT NULL, "status" text NOT NULL, "isReportReady" boolean NOT NULL, CONSTRAINT "PK_52465524569a0b0e856a64eb48b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shared_bidder_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "bidderId" uuid NOT NULL, "envelopeType" character varying NOT NULL, "privateKey" character varying NOT NULL, "contactName" character varying, "contactPhoneNumber" character varying, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_7238236a51e65ea6f7155260843" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_members" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid NOT NULL, "personnelId" uuid NOT NULL, "personnelName" uuid NOT NULL, "isTeamLead" boolean NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_ca3eae89dcf20c9fd95bf7460aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "envelopeType" integer NOT NULL, "teamType" integer NOT NULL, "memberLimit" integer NOT NULL, CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "offered-item-summaries" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric(14,2) NOT NULL DEFAULT '0', "amount" numeric(14,2) NOT NULL DEFAULT '0', "offeredPrice" numeric(14,2) NOT NULL DEFAULT '0', "tax" numeric NOT NULL, "currency" character varying NOT NULL, "exchangeRate" numeric(14,2) NOT NULL DEFAULT '0', "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_5fc63ee8b85c2b153fbd5e6d52c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "offered-item-breakdowns" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "billOfQuantityId" uuid NOT NULL, "parentCode" character varying, "code" character varying NOT NULL, "category" character varying NOT NULL, "adjustedQuantity" numeric(14,2) NOT NULL DEFAULT '0', "offeredUnitPrice" numeric(14,2) NOT NULL DEFAULT '0', "originalQuantity" numeric(14,2) DEFAULT '0', "totalAmount" numeric(14,2) NOT NULL DEFAULT '0', "currency" character varying NOT NULL, "exchangeRate" numeric(14,2) DEFAULT '0', CONSTRAINT "PK_446cea4e282e76ce79994369e3e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "milestones_trackers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "milestoneType" text NOT NULL, "plannedStartDate" TIMESTAMP NOT NULL, "actualStartDate" TIMESTAMP, "plannedEndDate" TIMESTAMP NOT NULL, "actualEndDate" TIMESTAMP, "timeStamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_f24c9f1797cfd09afb32dd1501d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "checked" boolean NOT NULL, "remark" text, "isFirstChecked" boolean NOT NULL, "isSecondChecked" boolean NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_9a8671aa31cb7afd3f75b62af08" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bid_documentary_evidences"`);
    await queryRunner.query(`DROP TABLE "milestones_trackers"`);
    await queryRunner.query(`DROP TABLE "offered-item-breakdowns"`);
    await queryRunner.query(`DROP TABLE "offered-item-summaries"`);
    await queryRunner.query(`DROP TABLE "teams"`);
    await queryRunner.query(`DROP TABLE "team_members"`);
    await queryRunner.query(`DROP TABLE "shared_bidder_keys"`);
    await queryRunner.query(`DROP TABLE "openings"`);
    await queryRunner.query(`DROP TABLE "bid_opening_checklists"`);
    await queryRunner.query(`DROP TABLE "bid-securities"`);
    await queryRunner.query(`DROP TABLE "bid_opening_minutes"`);
  }
}

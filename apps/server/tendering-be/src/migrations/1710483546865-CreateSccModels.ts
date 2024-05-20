import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSccModels1710483546865 implements MigrationInterface {
  name = 'CreateSccModels1710483546865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "scc_contract_deliverables" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "deliverable" text array NOT NULL, "deliverySchedule" integer NOT NULL, CONSTRAINT "PK_c0c61be27116a78e58e54138d00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_general_provisions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "contractDuration" integer NOT NULL, "commencementDay" integer NOT NULL DEFAULT '1', "deliverySite" character varying NOT NULL, CONSTRAINT "PK_4d9aa7f75432040d2aa083c39ae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_guarantees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "guaranteeType" character varying NOT NULL, "guaranteeRequired" boolean NOT NULL, "guaranteePercentage" integer NOT NULL, "currency" character varying(4) NOT NULL, "guaranteeForm" text array NOT NULL, "validityPeriod" integer NOT NULL, CONSTRAINT "PK_6cb526b18cfc761febc0951c5b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_liabilities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "warrantyPeriod" integer, "postWarrantyServicePeriod" integer, "liquidityDamage" integer NOT NULL DEFAULT '0', "liquidityDamageLimit" integer NOT NULL, CONSTRAINT "PK_001f88b8d869d57ab263d3b8cac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_payment_schedules" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "paymentSchedule" character varying NOT NULL, "paymentPercentage" integer NOT NULL, "order" integer NOT NULL, "requiredDocuments" text array NOT NULL, CONSTRAINT "PK_e5c64a4a278245ee8e09747ce21" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scc_payment_terms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "contractCurrency" text array NOT NULL, "paymentMode" text array NOT NULL, "advancePaymentAllowed" boolean NOT NULL DEFAULT true, "advancePaymentLimit" integer NOT NULL DEFAULT '0', "paymentReleasePeriod" integer NOT NULL, "latePaymentPenalty" integer NOT NULL, CONSTRAINT "PK_b561cbab1bef32331a72d820e86" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_contract_deliverables" ADD CONSTRAINT "FK_ab389b9345a79eff2840ea0cd87" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_general_provisions" ADD CONSTRAINT "FK_cad96f8e115b1b724ca79295b2a" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_guarantees" ADD CONSTRAINT "FK_a7e3e8ddf4541310672f895986a" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_liabilities" ADD CONSTRAINT "FK_fcab02b2b652023cc66c9a1e341" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_payment_schedules" ADD CONSTRAINT "FK_669e50a60ea369261f632231d98" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_payment_terms" ADD CONSTRAINT "FK_6b17d4efb50d8a5e376f25bb69f" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scc_payment_terms" DROP CONSTRAINT "FK_6b17d4efb50d8a5e376f25bb69f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_payment_schedules" DROP CONSTRAINT "FK_669e50a60ea369261f632231d98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_liabilities" DROP CONSTRAINT "FK_fcab02b2b652023cc66c9a1e341"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_guarantees" DROP CONSTRAINT "FK_a7e3e8ddf4541310672f895986a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_general_provisions" DROP CONSTRAINT "FK_cad96f8e115b1b724ca79295b2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scc_contract_deliverables" DROP CONSTRAINT "FK_ab389b9345a79eff2840ea0cd87"`,
    );
    await queryRunner.query(`DROP TABLE "scc_payment_terms"`);
    await queryRunner.query(`DROP TABLE "scc_payment_schedules"`);
    await queryRunner.query(`DROP TABLE "scc_liabilities"`);
    await queryRunner.query(`DROP TABLE "scc_guarantees"`);
    await queryRunner.query(`DROP TABLE "scc_general_provisions"`);
    await queryRunner.query(`DROP TABLE "scc_contract_deliverables"`);
  }
}

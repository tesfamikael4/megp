import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGuaranteeColumns1711093208672 implements MigrationInterface {
  name = 'UpdateGuaranteeColumns1711093208672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "vendorId" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "startDate"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "startDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "endDate"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "endDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "objectType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorValidityDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "title" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "objectId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "currencyType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "guarantorId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "guarantorBranchId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "guarantorBranchId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "guarantorId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "currencyType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "objectId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "title" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorValidityDate" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "objectType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "endDate"`);
    await queryRunner.query(`ALTER TABLE "guarantees" ADD "endDate" date`);
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "startDate"`);
    await queryRunner.query(`ALTER TABLE "guarantees" ADD "startDate" date`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "vendorId" DROP NOT NULL`,
    );
  }
}

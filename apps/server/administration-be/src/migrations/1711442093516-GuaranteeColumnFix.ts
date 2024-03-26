import { MigrationInterface, QueryRunner } from 'typeorm';

export class GuaranteeColumnFix1711442093516 implements MigrationInterface {
  name = 'GuaranteeColumnFix1711442093516';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "vendorName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorBranchName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorName" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "vendorId"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "vendorId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "startDate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "endDate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "guarantorValidityDate" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "objectId"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "objectId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorBranchId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorBranchId" uuid NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorBranchId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorBranchId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "objectId"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "objectId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "guarantorValidityDate" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "endDate" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "startDate" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "vendorId"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "vendorId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorBranchName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "vendorName"`,
    );
  }
}

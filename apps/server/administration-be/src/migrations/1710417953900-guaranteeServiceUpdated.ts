import { MigrationInterface, QueryRunner } from 'typeorm';

export class GuaranteeServiceUpdated1710417953900
  implements MigrationInterface
{
  name = 'GuaranteeServiceUpdated1710417953900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "GuarantorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "GuarantorBranchId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "guarantorBranchId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "amount" numeric(14,2) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "amount"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "amount" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantee_extensions" ALTER COLUMN "status" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorBranchId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "guarantorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "GuarantorBranchId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "GuarantorId" character varying`,
    );
  }
}

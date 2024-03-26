import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGuaranteeModells1711435838986 implements MigrationInterface {
  name = 'UpdateGuaranteeModells1711435838986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "vendorId"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "vendorId" uuid NOT NULL`,
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
    await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "vendorId"`);
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "vendorId" character varying NOT NULL`,
    );
  }
}

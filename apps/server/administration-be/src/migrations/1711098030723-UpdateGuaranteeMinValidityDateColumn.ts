import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGuaranteeMinValidityDateColumn1711098030723
  implements MigrationInterface
{
  name = 'UpdateGuaranteeMinValidityDateColumn1711098030723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "minValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "minValidityDate" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" DROP COLUMN "minValidityDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guarantees" ADD "minValidityDate" date`,
    );
  }
}

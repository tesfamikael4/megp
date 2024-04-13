import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidGuaranteeEntity1713016614782
  implements MigrationInterface
{
  name = 'UpdateOnBidGuaranteeEntity1713016614782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" DROP COLUMN "hashVaue"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" DROP COLUMN "guatranteeReference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" ADD "hashValue" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" ADD "guaranteeReference" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" DROP COLUMN "guaranteeReference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" DROP COLUMN "hashValue"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" ADD "guatranteeReference" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" ADD "hashVaue" character varying`,
    );
  }
}

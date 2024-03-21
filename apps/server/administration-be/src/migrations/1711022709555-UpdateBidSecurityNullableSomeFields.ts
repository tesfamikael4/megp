import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBidSecurityNullableSomeFields1711022709555
  implements MigrationInterface
{
  name = 'UpdateBidSecurityNullableSomeFields1711022709555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guarantees" ALTER COLUMN "type" SET DEFAULT 'BID_SECURITY'`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueReason1705497934650 implements MigrationInterface {
  name = 'UniqueReason1705497934650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "UQ_de333f741602ac65257708c30d4" UNIQUE ("reason")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "UQ_de333f741602ac65257708c30d4"`,
    );
  }
}

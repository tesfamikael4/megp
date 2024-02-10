import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceEntityUpdate1704349234502 implements MigrationInterface {
  name = 'ServiceEntityUpdate1704349234502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bp_services" DROP COLUMN "businessAreaId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bp_services" ADD "businessAreaId" character varying`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniquenessOnEnties1709647257368 implements MigrationInterface {
  name = 'UniquenessOnEnties1709647257368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "UQ_c8111ed4710e0aa60818868243a" UNIQUE ("name", "organizationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_types" ADD CONSTRAINT "UQ_bac5f8bed9cf4b3c2b2a391a33a" UNIQUE ("name", "organizationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "UQ_f6a1e7eb514e26b61f7f599cc46" UNIQUE ("name", "organizationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_d27a5e69fb41256abed347a85eb" UNIQUE ("name", "organizationId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "UQ_d27a5e69fb41256abed347a85eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP CONSTRAINT "UQ_f6a1e7eb514e26b61f7f599cc46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_types" DROP CONSTRAINT "UQ_bac5f8bed9cf4b3c2b2a391a33a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" DROP CONSTRAINT "UQ_c8111ed4710e0aa60818868243a"`,
    );
  }
}

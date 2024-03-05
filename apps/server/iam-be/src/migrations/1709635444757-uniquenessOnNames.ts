import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniquenessOnNames1709635444757 implements MigrationInterface {
  name = 'UniquenessOnNames1709635444757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "UQ_664ea405ae2a10c264d582ee563" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_types" ADD CONSTRAINT "UQ_3fdb879fb0a22acc11945777b7a" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "UQ_cd34e4bfea359fa09d997a0b87d" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP CONSTRAINT "UQ_cd34e4bfea359fa09d997a0b87d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_types" DROP CONSTRAINT "UQ_3fdb879fb0a22acc11945777b7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" DROP CONSTRAINT "UQ_664ea405ae2a10c264d582ee563"`,
    );
  }
}

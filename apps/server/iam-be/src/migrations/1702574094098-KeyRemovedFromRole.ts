import { MigrationInterface, QueryRunner } from 'typeorm';

export class KeyRemovedFromRole1702574094098 implements MigrationInterface {
  name = 'KeyRemovedFromRole1702574094098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "UQ_c63f25e362340df593c13fb1525"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "key"`);
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "UQ_47635c1ab22d02fc3ebae3608b8" UNIQUE ("code")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units" DROP CONSTRAINT "UQ_47635c1ab22d02fc3ebae3608b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "key" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_c63f25e362340df593c13fb1525" UNIQUE ("key", "organizationId")`,
    );
  }
}

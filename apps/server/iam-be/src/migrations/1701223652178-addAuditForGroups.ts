import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuditForGroups1701223652178 implements MigrationInterface {
  name = 'AddAuditForGroups1701223652178';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "groups" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "groups" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "tenantId"`);
  }
}

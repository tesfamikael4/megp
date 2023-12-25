import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrgId1703500150987 implements MigrationInterface {
  name = 'OrgId1703500150987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "steps" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "steps" ADD "organizationId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "workflows" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflows" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflows" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflows" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflows" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" ADD "organizationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "tenantId" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "organizationId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "states" ADD "organizationId" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "states" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "tenantId"`);
    await queryRunner.query(
      `ALTER TABLE "default_steps" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "tenantId"`);
    await queryRunner.query(
      `ALTER TABLE "workflows" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(`ALTER TABLE "workflows" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "workflows" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "workflows" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "workflows" DROP COLUMN "tenantId"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "organizationId"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "tenantId"`);
    await queryRunner.query(
      `ALTER TABLE "instances" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "tenantId"`);
  }
}

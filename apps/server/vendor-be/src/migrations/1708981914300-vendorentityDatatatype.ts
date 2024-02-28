import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendorentityDatatatype1708981914300 implements MigrationInterface {
  name = 'VendorentityDatatatype1708981914300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "brifecases" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attachmentId" character varying NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_cd7cd234bcddcb7ea0be2a04634" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "briefcases" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "name" character varying, "attachmentId" character varying NOT NULL, CONSTRAINT "PK_82f2080e8fdd53e6d8af453e346" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "country"`);
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "registrationNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD CONSTRAINT "UQ_00c907c2c95d313306402fa7282" UNIQUE ("registrationNumber")`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "canRequest" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "canRequest"`);
    await queryRunner.query(
      `ALTER TABLE "vendors" DROP CONSTRAINT "UQ_00c907c2c95d313306402fa7282"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" DROP COLUMN "registrationNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ADD "country" character varying NOT NULL DEFAULT 'Malian'`,
    );
    await queryRunner.query(`DROP TABLE "briefcases"`);
    await queryRunner.query(`DROP TABLE "brifecases"`);
  }
}

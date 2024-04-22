import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedDonors1713777597690 implements MigrationInterface {
  name = 'CreatedDonors1713777597690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "donors" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_da785d6806e4471f2ecc6a002fe" UNIQUE ("name"), CONSTRAINT "PK_7fafae759bcc8cc1dfa09c3fbcf" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "donors"`);
  }
}

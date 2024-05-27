import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tax1716269359463 implements MigrationInterface {
  name = 'Tax1716269359463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "taxs" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "shortName" character varying NOT NULL, "percentage" integer NOT NULL, CONSTRAINT "UQ_471724b61c177dc8685aef5f04c" UNIQUE ("name"), CONSTRAINT "PK_638c67865702518fe536b6fe0b5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "taxs"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenderPersonal1711192577434 implements MigrationInterface {
  name = 'AddTenderPersonal1711192577434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tender_personals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "position" character varying NOT NULL, "evaluated" boolean NOT NULL, "order" character varying NOT NULL, CONSTRAINT "PK_d1a8a37d20b6130a8583bdf6825" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_personals" ADD CONSTRAINT "FK_f8ddc0f232115aa707cb1116a6c" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_personals" DROP CONSTRAINT "FK_f8ddc0f232115aa707cb1116a6c"`,
    );
    await queryRunner.query(`DROP TABLE "tender_personals"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpdOpeningChecklist1711518365845 implements MigrationInterface {
  name = 'AddSpdOpeningChecklist1711518365845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spd_opening_checklists" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "name" character varying NOT NULL, "isBoolean" boolean NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_3b76ae674bd35534bade3cd3971" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_opening_checklists" ADD CONSTRAINT "FK_41fba7b1fef84bdde974b4e724d" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_opening_checklists" DROP CONSTRAINT "FK_41fba7b1fef84bdde974b4e724d"`,
    );
    await queryRunner.query(`DROP TABLE "spd_opening_checklists"`);
  }
}

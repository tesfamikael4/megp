import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTableName1702668303345 implements MigrationInterface {
  name = 'ChangeTableName1702668303345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "instances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityId" uuid NOT NULL, "status" character varying NOT NULL, CONSTRAINT "REL_6972278b42de1df61ff204a078" UNIQUE ("activityId"), CONSTRAINT "PK_11862209053330b4765f7f54178" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "steps" DROP CONSTRAINT "FK_ae5610f0c2355ba090363087343"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" DROP CONSTRAINT "UQ_ae5610f0c2355ba090363087343"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_ae5610f0c2355ba090363087343" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_6972278b42de1df61ff204a0780" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_6972278b42de1df61ff204a0780"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" DROP CONSTRAINT "FK_ae5610f0c2355ba090363087343"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "UQ_ae5610f0c2355ba090363087343" UNIQUE ("activityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_ae5610f0c2355ba090363087343" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "instances"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeWorkflow1702667958356 implements MigrationInterface {
  name = 'ChangeWorkflow1702667958356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "rule"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "approvers"`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approvers" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "rule" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "steps" ADD "order" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "status" character varying NOT NULL`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "steps" DROP CONSTRAINT "FK_ae5610f0c2355ba090363087343"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" DROP CONSTRAINT "UQ_ae5610f0c2355ba090363087343"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_ae5610f0c2355ba090363087343" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "order"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "rule"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "approvers"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approvers" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "rule" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "name" character varying NOT NULL`,
    );
  }
}

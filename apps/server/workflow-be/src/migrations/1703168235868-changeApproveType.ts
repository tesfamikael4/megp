import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeApproveType1703168235868 implements MigrationInterface {
  name = 'ChangeApproveType1703168235868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "default_steps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "activityId" uuid NOT NULL, "approvers" jsonb NOT NULL, "type" character varying NOT NULL DEFAULT 'default', "order" integer NOT NULL, CONSTRAINT "PK_5e776ccb71fd9c48837319e233e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" DROP COLUMN "approvalMethods"`,
    );
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "approverTypes"`);
    await queryRunner.query(
      `ALTER TABLE "default_steps" ADD CONSTRAINT "FK_6497d31ce37e394a2e3fdfa3f38" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "default_steps" DROP CONSTRAINT "FK_6497d31ce37e394a2e3fdfa3f38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approverTypes" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approvalMethods" jsonb NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "default_steps"`);
  }
}

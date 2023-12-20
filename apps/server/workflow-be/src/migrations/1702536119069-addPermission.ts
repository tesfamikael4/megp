import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPermission1702536119069 implements MigrationInterface {
  name = 'AddPermission1702536119069';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "activityId" uuid NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP COLUMN "permission"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_dd9d0902bb6bf199152e8ca5bbd" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_dd9d0902bb6bf199152e8ca5bbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "permission" jsonb NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}

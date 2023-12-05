import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnRole1701777717417 implements MigrationInterface {
  name = 'UpdateOnRole1701777717417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "organizationId"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD "organizationId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "organizationId"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "organizationId" character varying`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelationOfInstance1704195918099
  implements MigrationInterface
{
  name = 'ChangeRelationOfInstance1704195918099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "steps" DROP CONSTRAINT "FK_020d35a8979ccb1397aa4ea8245"`,
    );
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "instanceId"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "stepId"`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "stepId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_09422b1afb67285d2d7e06af1f2" FOREIGN KEY ("stepId") REFERENCES "steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_09422b1afb67285d2d7e06af1f2"`,
    );
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "stepId"`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "stepId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "steps" ADD "instanceId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_020d35a8979ccb1397aa4ea8245" FOREIGN KEY ("instanceId") REFERENCES "instances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

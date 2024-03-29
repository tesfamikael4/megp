import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelationOfInstance1711705968841
  implements MigrationInterface
{
  name = 'ChangeRelationOfInstance1711705968841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_09422b1afb67285d2d7e06af1f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" RENAME COLUMN "stepId" TO "instanceStepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_a6cffc72cfb0959f7adf95e076a" FOREIGN KEY ("instanceStepId") REFERENCES "instance_steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_a6cffc72cfb0959f7adf95e076a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" RENAME COLUMN "instanceStepId" TO "stepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_09422b1afb67285d2d7e06af1f2" FOREIGN KEY ("stepId") REFERENCES "steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

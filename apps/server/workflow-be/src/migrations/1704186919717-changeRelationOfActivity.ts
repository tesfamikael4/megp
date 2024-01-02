import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelationOfActivity1704186919717
  implements MigrationInterface
{
  name = 'ChangeRelationOfActivity1704186919717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_09422b1afb67285d2d7e06af1f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "itemName" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "steps" ADD "instanceId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_6972278b42de1df61ff204a0780"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "REL_6972278b42de1df61ff204a078"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "UQ_09422b1afb67285d2d7e06af1f2"`,
    );
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "stepId"`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "stepId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "activityId"`);
    await queryRunner.query(
      `ALTER TABLE "states" ADD "activityId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_6972278b42de1df61ff204a0780" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_020d35a8979ccb1397aa4ea8245" FOREIGN KEY ("instanceId") REFERENCES "instances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "states" ADD CONSTRAINT "FK_6bfa9eb0d77ac638ec0500d280d" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "states" DROP CONSTRAINT "FK_6bfa9eb0d77ac638ec0500d280d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" DROP CONSTRAINT "FK_020d35a8979ccb1397aa4ea8245"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_6972278b42de1df61ff204a0780"`,
    );
    await queryRunner.query(`ALTER TABLE "states" DROP COLUMN "activityId"`);
    await queryRunner.query(
      `ALTER TABLE "states" ADD "activityId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "stepId"`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "stepId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "UQ_09422b1afb67285d2d7e06af1f2" UNIQUE ("stepId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "REL_6972278b42de1df61ff204a078" UNIQUE ("activityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_6972278b42de1df61ff204a0780" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "instanceId"`);
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "itemName"`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_09422b1afb67285d2d7e06af1f2" FOREIGN KEY ("stepId") REFERENCES "steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

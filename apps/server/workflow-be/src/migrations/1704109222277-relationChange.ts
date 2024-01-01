import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelationChange1704109222277 implements MigrationInterface {
  name = 'RelationChange1704109222277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_6972278b42de1df61ff204a0780"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "REL_6972278b42de1df61ff204a078"`,
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
      `ALTER TABLE "instances" ADD CONSTRAINT "REL_6972278b42de1df61ff204a078" UNIQUE ("activityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_6972278b42de1df61ff204a0780" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

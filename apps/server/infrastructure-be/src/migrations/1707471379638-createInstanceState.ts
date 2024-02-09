import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInstanceState1707471379638 implements MigrationInterface {
  name = 'CreateInstanceState1707471379638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "instance_steps" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "title" character varying NOT NULL, "activityId" uuid NOT NULL, "approvers" jsonb NOT NULL, "type" character varying NOT NULL, "order" integer NOT NULL, "itemId" character varying NOT NULL, CONSTRAINT "PK_0ed94e16793581f6e5fa9a37744" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "stateId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "instance_steps" ADD CONSTRAINT "FK_e7288531c65e9072590e0572f4a" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instance_steps" DROP CONSTRAINT "FK_e7288531c65e9072590e0572f4a"`,
    );
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "stateId"`);
    await queryRunner.query(`DROP TABLE "instance_steps"`);
  }
}

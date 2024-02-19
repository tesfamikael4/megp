import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoteKeyStateJoinColumn1708320573212 implements MigrationInterface {
  name = 'NoteKeyStateJoinColumn1708320573212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes" ADD "key" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "stateId"`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "stateId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "UQ_c5218b7eead88f9ed5329deea5c" UNIQUE ("stateId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_c5218b7eead88f9ed5329deea5c" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_c5218b7eead88f9ed5329deea5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "UQ_c5218b7eead88f9ed5329deea5c"`,
    );
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "stateId"`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "stateId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "key"`);
  }
}

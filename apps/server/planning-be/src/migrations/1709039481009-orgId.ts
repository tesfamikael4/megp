import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrgId1709039481009 implements MigrationInterface {
  name = 'OrgId1709039481009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" DROP COLUMN "organization"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ADD "organization" character varying NOT NULL`,
    );
  }
}

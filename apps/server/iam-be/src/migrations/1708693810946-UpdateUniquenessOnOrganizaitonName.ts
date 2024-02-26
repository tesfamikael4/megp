import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUniquenessOnOrganizaitonName1708693810946
  implements MigrationInterface
{
  name = 'UpdateUniquenessOnOrganizaitonName1708693810946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "UQ_9b7ca6d30b94fef571cff876884" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_types" ADD CONSTRAINT "UQ_e05bb7f747b1ac8212c588cf719" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_types" DROP CONSTRAINT "UQ_e05bb7f747b1ac8212c588cf719"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "UQ_9b7ca6d30b94fef571cff876884"`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class OnOrganizationAndRoleEntity1702452247344
  implements MigrationInterface
{
  name = 'OnOrganizationAndRoleEntity1702452247344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units" ALTER COLUMN "code" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "UQ_47635c1ab22d02fc3ebae3608b8" UNIQUE ("code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "UQ_c63f25e362340df593c13fb1525"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "UQ_7e27c3b62c681fbe3e2322535f2" UNIQUE ("code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_c63f25e362340df593c13fb1525" UNIQUE ("key", "organizationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "UQ_c63f25e362340df593c13fb1525"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "UQ_7e27c3b62c681fbe3e2322535f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_c63f25e362340df593c13fb1525" UNIQUE ("key", "organizationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP CONSTRAINT "UQ_47635c1ab22d02fc3ebae3608b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ALTER COLUMN "code" DROP NOT NULL`,
    );
  }
}

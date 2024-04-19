import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnOrgTypes1708692463935 implements MigrationInterface {
  name = 'UpdateOnOrgTypes1708692463935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c" FOREIGN KEY ("typeId") REFERENCES "organization_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c" FOREIGN KEY ("typeId") REFERENCES "organization_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}

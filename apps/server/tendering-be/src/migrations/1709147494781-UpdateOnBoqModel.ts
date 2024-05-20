import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBoqModel1709147494781 implements MigrationInterface {
  name = 'UpdateOnBoqModel1709147494781';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" DROP CONSTRAINT "FK_8fac7c9c13bd7e421bd0638e40f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" DROP CONSTRAINT "REL_8fac7c9c13bd7e421bd0638e40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" DROP COLUMN "parentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ADD "code" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ADD "parentCode" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" DROP COLUMN "parentCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" DROP COLUMN "code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ADD "parentId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ADD CONSTRAINT "REL_8fac7c9c13bd7e421bd0638e40" UNIQUE ("parentId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ADD CONSTRAINT "FK_8fac7c9c13bd7e421bd0638e40f" FOREIGN KEY ("parentId") REFERENCES "sor_bill_of_materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnUnitModel1702977023859 implements MigrationInterface {
  name = 'UpdateOnUnitModel1702977023859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units" ALTER COLUMN "code" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units" ALTER COLUMN "code" SET NOT NULL`,
    );
  }
}

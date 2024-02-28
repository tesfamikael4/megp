import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnFeeModel1709152041295 implements MigrationInterface {
  name = 'UpdateOnFeeModel1709152041295';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sor_incidental_costs" ALTER COLUMN "currency" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sor_incidental_costs" ALTER COLUMN "currency" SET NOT NULL`,
    );
  }
}

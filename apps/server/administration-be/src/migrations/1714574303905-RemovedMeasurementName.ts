import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedMeasurementName1714574303905 implements MigrationInterface {
  name = 'RemovedMeasurementName1714574303905';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "unit_of_measurements" DROP COLUMN "measurementName"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "unit_of_measurements" ADD "measurementName" character varying`,
    );
  }
}

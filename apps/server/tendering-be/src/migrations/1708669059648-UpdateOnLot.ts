import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnLot1708669059648 implements MigrationInterface {
  name = 'UpdateOnLot1708669059648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "metadata" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lots" ALTER COLUMN "metadata" SET NOT NULL`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreferencialeEntityUpdates1709796010658
  implements MigrationInterface
{
  name = 'PreferencialeEntityUpdates1709796010658';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP CONSTRAINT "FK_00b3a22df6dc5ecdfedc9fa4521"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD CONSTRAINT "FK_00b3a22df6dc5ecdfedc9fa4521" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

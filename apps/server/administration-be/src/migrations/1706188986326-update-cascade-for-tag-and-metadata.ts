import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCascadeForTagAndMetadata1706188986326
  implements MigrationInterface
{
  name = 'UpdateCascadeForTagAndMetadata1706188986326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_tags" DROP CONSTRAINT "FK_d0d098ba6673fa09f82f8a8bdf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_meta_data" DROP CONSTRAINT "FK_e92844fd4f98c0c4f64882f9b34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tags" ADD CONSTRAINT "FK_d0d098ba6673fa09f82f8a8bdf2" FOREIGN KEY ("itemMasterId") REFERENCES "item_masters"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_meta_data" ADD CONSTRAINT "FK_e92844fd4f98c0c4f64882f9b34" FOREIGN KEY ("itemMasterId") REFERENCES "item_masters"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_meta_data" DROP CONSTRAINT "FK_e92844fd4f98c0c4f64882f9b34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tags" DROP CONSTRAINT "FK_d0d098ba6673fa09f82f8a8bdf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_meta_data" ADD CONSTRAINT "FK_e92844fd4f98c0c4f64882f9b34" FOREIGN KEY ("itemMasterId") REFERENCES "item_masters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tags" ADD CONSTRAINT "FK_d0d098ba6673fa09f82f8a8bdf2" FOREIGN KEY ("itemMasterId") REFERENCES "item_masters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}

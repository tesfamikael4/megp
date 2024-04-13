import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendorRegistrationNumber1713021191747
  implements MigrationInterface
{
  name = 'VendorRegistrationNumber1713021191747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ADD "registrationNumber" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" DROP COLUMN "registrationNumber"`,
    );
  }
}

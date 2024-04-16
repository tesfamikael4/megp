import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTypeFromBidGuarantee1713267028533
  implements MigrationInterface
{
  name = 'DropTypeFromBidGuarantee1713267028533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bid_guarantees" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."bid_guarantees_type_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bid_guarantees_type_enum" AS ENUM('BID_GUARANTEE', 'ADVANCED', 'PERFORMANCE', 'RETENTION')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_guarantees" ADD "type" "public"."bid_guarantees_type_enum" NOT NULL`,
    );
  }
}

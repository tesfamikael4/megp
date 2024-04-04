import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnPaymentInvoiceModel1712239312563
  implements MigrationInterface
{
  name = 'UpdateOnPaymentInvoiceModel1712239312563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payment_invoices_type_enum" AS ENUM('ONLINE', 'OFFLINE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" ADD "type" "public"."payment_invoices_type_enum" NOT NULL DEFAULT 'ONLINE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" ADD "service" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" ADD "bankReferenceNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" ADD CONSTRAINT "UQ_fe9678ce6b59f78eb02e839064c" UNIQUE ("bankReferenceNumber")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" ALTER COLUMN "sessionId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" ALTER COLUMN "notificationUrl" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" ALTER COLUMN "notificationUrl" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" ALTER COLUMN "sessionId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" DROP CONSTRAINT "UQ_fe9678ce6b59f78eb02e839064c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" DROP COLUMN "bankReferenceNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" DROP COLUMN "service"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_invoices" DROP COLUMN "type"`,
    );
    await queryRunner.query(`DROP TYPE "public"."payment_invoices_type_enum"`);
  }
}

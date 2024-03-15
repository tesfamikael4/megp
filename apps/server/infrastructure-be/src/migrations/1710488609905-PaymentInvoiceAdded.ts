import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentInvoiceAdded1710488609905 implements MigrationInterface {
  name = 'PaymentInvoiceAdded1710488609905';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_invoices" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "applicationKey" character varying NOT NULL, "amount" numeric(14,2) NOT NULL, "currency" character varying NOT NULL, "invoiceReference" character varying NOT NULL, "sessionId" character varying NOT NULL, "orderId" character varying NOT NULL, "notificationUrl" character varying NOT NULL, "callbackUrl" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "UQ_a926ccdcd8e075d3c9b572a2ba9" UNIQUE ("invoiceReference"), CONSTRAINT "UQ_efaa7ebbcfb3be0fdf32173da8f" UNIQUE ("sessionId"), CONSTRAINT "UQ_080ddf1630c5ecc8098ce04cde5" UNIQUE ("orderId"), CONSTRAINT "PK_41d5ecc2ca516ca9c179f0f0065" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_invoices"`);
  }
}

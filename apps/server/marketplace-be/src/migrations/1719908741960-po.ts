import { MigrationInterface, QueryRunner } from 'typeorm';

export class Po1719908741960 implements MigrationInterface {
  name = 'Po1719908741960';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "po_attachments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchaseOrderId" uuid NOT NULL, "fileInfo" jsonb NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_6e370b4b0790d4f0ed96dd53682" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "po_terms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchaseOrderId" uuid NOT NULL, "warrantyPeriod" integer NOT NULL, "liquidityDamage" numeric NOT NULL DEFAULT '0', "liquidityDamageLimit" numeric NOT NULL DEFAULT '0', "paymentTerms" character varying NOT NULL, "terms" json NOT NULL, "deliveryPeriod" character varying NOT NULL, "isPartialPaymentAllowed" boolean NOT NULL, CONSTRAINT "PK_b4832c27f3d46559d0c7aad0a0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "voucher_details" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "poItemId" uuid NOT NULL, "paymentVoucherId" uuid NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "unitPrice" numeric NOT NULL, "totalPrice" numeric NOT NULL, "deduction" numeric NOT NULL, "taxAmount" numeric NOT NULL, "dueAmount" numeric NOT NULL, CONSTRAINT "PK_93d4b7e6283de3d52e57a1bb565" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_vouchers_paymentstatus_enum" AS ENUM('Active', 'Inactive', 'Draft')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_vouchers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchaseOrderId" uuid NOT NULL, "invoiceId" uuid NOT NULL, "voucherReferenceNumber" character varying NOT NULL, "paidTo" character varying NOT NULL, "paidBy" character varying NOT NULL, "preparedBy" character varying NOT NULL, "preparedDate" TIMESTAMP WITH TIME ZONE NOT NULL, "paymentMethod" character varying NOT NULL, "totalInvoiceAmount" numeric NOT NULL DEFAULT '0', "netPayableAmount" numeric NOT NULL DEFAULT '0', "taxRate" numeric NOT NULL DEFAULT '0', "totalTaxAmount" numeric NOT NULL DEFAULT '0', "totalDueAmount" numeric NOT NULL DEFAULT '0', "approvedById" character varying, "approvedBy" character varying NOT NULL, "paidDate" TIMESTAMP WITH TIME ZONE NOT NULL, "paymentStatus" "public"."payment_vouchers_paymentstatus_enum" NOT NULL, CONSTRAINT "PK_9b9ec6a3f1192c7917fe1b7438a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_attachments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoiceId" uuid NOT NULL, "fileInfo" jsonb NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_b9cccbd0fde8dedc71d0f11ec59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."invoices_status_enum" AS ENUM('Active', 'Inactive', 'Draft')`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoices" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchaseOrderId" uuid NOT NULL, "itemReceiveId" uuid NOT NULL, "supplierName" character varying NOT NULL, "taxId" integer NOT NULL, "remitTo" character varying NOT NULL, "bankName" character varying NOT NULL, "remitToBankAccount" integer NOT NULL, "poReference" character varying NOT NULL, "invoiceNumber" integer NOT NULL, "invoiceType" character varying NOT NULL, "invoiceDate" TIMESTAMP NOT NULL, "currency" character varying NOT NULL, "status" "public"."invoices_status_enum" NOT NULL DEFAULT 'Draft', CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."acceptance_items_status_enum" AS ENUM('Draft', 'Completed', 'Partially Accepted', 'Rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "acceptance_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "acceptanceNoteId" uuid NOT NULL, "poItemId" uuid NOT NULL, "orderedQuantity" integer NOT NULL, "deliveredQuantity" integer NOT NULL, "unitPrice" numeric NOT NULL DEFAULT '0', "uom" character varying NOT NULL, "remark" character varying, "status" "public"."acceptance_items_status_enum" NOT NULL DEFAULT 'Draft', CONSTRAINT "PK_3281b21f158047f16d096eafada" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."acceptance_notes_status_enum" AS ENUM('Draft', 'Completed', 'Partially Accepted', 'Rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "acceptance_notes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "acceptanceNumber" character varying NOT NULL, "purchaseOrderId" uuid NOT NULL, "receivedDate" TIMESTAMP WITH TIME ZONE NOT NULL, "deliveryLocation" json NOT NULL, "checkedById" character varying, "checkedByName" character varying NOT NULL, "description" character varying, "orderNumber" character varying NOT NULL, "vendorId" character varying NOT NULL, "vendorName" character varying NOT NULL, "status" "public"."acceptance_notes_status_enum" NOT NULL DEFAULT 'Draft', CONSTRAINT "PK_ba7c2898544e50bcc68c99de089" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shipment_and_handlings" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemShipmentId" uuid NOT NULL, "itemId" uuid NOT NULL, "amount" character varying NOT NULL, "chargeType" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c43073f203411fe748150cf8475" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_shipments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "poItemId" uuid NOT NULL, "poShipmentId" uuid NOT NULL, "itemName" character varying NOT NULL, "quantity" numeric NOT NULL DEFAULT '0', CONSTRAINT "PK_d04ca2823b5a835bd02f16fb716" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."po_shipments_status_enum" AS ENUM('Draft', 'Approved', 'Shipped', 'Delivered', 'Cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "po_shipments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchaseOrderId" uuid NOT NULL, "description" character varying, "deliveryLocation" jsonb NOT NULL, "quantity" numeric NOT NULL DEFAULT '0', "uom" character varying, "expectedDeliveryDate" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."po_shipments_status_enum" NOT NULL DEFAULT 'Draft', CONSTRAINT "PK_ce8c52e7211cda268f90f121e38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."purchase_orders_status_enum" AS ENUM('Draft', 'Approved', 'Shipped', 'Delivered', 'Cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "purchase_orders" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "poReference" character varying NOT NULL, "awardNoteId" character varying NOT NULL, "procurementReference" character varying NOT NULL, "version" character varying NOT NULL DEFAULT '1.0.0', "vendorId" character varying NOT NULL, "vendorName" character varying NOT NULL, "description" character varying, "contactPerson" jsonb NOT NULL, "bankAccount" character varying, "bankName" character varying, "expectedDeliveryDate" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."purchase_orders_status_enum" NOT NULL DEFAULT 'Draft', CONSTRAINT "PK_05148947415204a897e8beb2553" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_budget_sources" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "poItemId" uuid NOT NULL, "chartOfAccount" jsonb NOT NULL, "quantity" numeric NOT NULL DEFAULT '0', "amount" numeric NOT NULL DEFAULT '0', "lineTotal" numeric NOT NULL DEFAULT '0', "uom" character varying NOT NULL, "currency" character varying NOT NULL, CONSTRAINT "PK_2029e15c0271c565bfc809bee4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_attachments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "poItemId" uuid NOT NULL, "fileInfo" jsonb NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_aaa915d5769d5039acaf7a5f932" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_receivers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "poItemId" uuid NOT NULL, "userId" character varying, "name" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_bc1b8b1a063d1d799150174aecf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemShipmentId" uuid NOT NULL, "poItemId" uuid NOT NULL, "itemName" character varying NOT NULL, "itemCode" character varying NOT NULL, "shipTo" character varying NOT NULL, "receivedQuantity" integer NOT NULL, "payableQuantity" integer NOT NULL, "unitPrice" numeric NOT NULL, "totalPrice" numeric NOT NULL, "isTaxIncluded" boolean NOT NULL, CONSTRAINT "PK_53b99f9e0e2945e69de1a12b75a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."po_items_status_enum" AS ENUM('Active', 'Inactive', 'Draft')`,
    );
    await queryRunner.query(
      `CREATE TABLE "po_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "purchaseOrderId" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "quantity" numeric NOT NULL DEFAULT '0', "availableQuantity" numeric NOT NULL DEFAULT '0', "price" numeric NOT NULL DEFAULT '0', "lineTotal" numeric NOT NULL DEFAULT '0', "uom" character varying NOT NULL, "currency" character varying NOT NULL, "specification" jsonb, "status" "public"."po_items_status_enum" NOT NULL DEFAULT 'Draft', CONSTRAINT "PK_fe9e87653e28514ed8d5e6240c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."receiving_items_status_enum" AS ENUM('Active', 'Inactive', 'Draft')`,
    );
    await queryRunner.query(
      `CREATE TABLE "receiving_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "receivingNoteId" uuid NOT NULL, "poItemId" uuid NOT NULL, "referenceNumber" character varying NOT NULL, "quantity" numeric NOT NULL DEFAULT '0', "itemName" character varying NOT NULL, "receivedDate" TIMESTAMP WITH TIME ZONE NOT NULL, "receivedBy" character varying NOT NULL, "deliveredBy" character varying, "uom" character varying NOT NULL, "specification" jsonb, "quantityDelivered" integer NOT NULL DEFAULT '0', "quantityAccepted" integer NOT NULL DEFAULT '0', "quantityRejected" integer NOT NULL DEFAULT '0', "rejectReason" character varying, "receiverNote" character varying, "status" "public"."receiving_items_status_enum" NOT NULL DEFAULT 'Draft', CONSTRAINT "PK_182784db2f4085fb3b207030d66" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "receiving_attachments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "receivingNoteId" uuid NOT NULL, "fileInfo" jsonb NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_0e287724d1dbcfa49d58deeef43" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."receiving_notes_status_enum" AS ENUM('Active', 'Inactive', 'Draft')`,
    );
    await queryRunner.query(
      `CREATE TABLE "receiving_notes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "poShipmentId" uuid NOT NULL, "purchaseOrderId" uuid NOT NULL, "orderNumber" character varying NOT NULL, "isCompleted" boolean NOT NULL, "totalQuantity" integer NOT NULL, "receivedQuantity" integer NOT NULL, "description" character varying NOT NULL, "vendorId" character varying NOT NULL, "vendorName" character varying NOT NULL, "status" "public"."receiving_notes_status_enum" NOT NULL DEFAULT 'Draft', CONSTRAINT "PK_bc18a61f22250b211e69e08284f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "acceptance_receives" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "receivingNoteId" uuid NOT NULL, "acceptanceNoteId" uuid NOT NULL, CONSTRAINT "PK_e4dcd725fc71965fc2f999c6e49" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "po_attachments" ADD CONSTRAINT "FK_1e49559d8b062375024c7cc9705" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "po_terms" ADD CONSTRAINT "FK_ec32cb12beee670fb5277c05f0f" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "voucher_details" ADD CONSTRAINT "FK_d6db24eeea9412e6558b3b3d7ae" FOREIGN KEY ("poItemId") REFERENCES "po_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "voucher_details" ADD CONSTRAINT "FK_e3e29ea8ede5ed0877a9a95043c" FOREIGN KEY ("paymentVoucherId") REFERENCES "payment_vouchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_vouchers" ADD CONSTRAINT "FK_468728bd809a72f015a75cde000" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_vouchers" ADD CONSTRAINT "FK_725be793bd66840f4e91ffaaccc" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_attachments" ADD CONSTRAINT "FK_221ffa6d864a6305ec083f309e5" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_737c75977327c5451139a1ba4e7" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acceptance_items" ADD CONSTRAINT "FK_57b6e64587efdd756bcf34061ce" FOREIGN KEY ("acceptanceNoteId") REFERENCES "acceptance_notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acceptance_items" ADD CONSTRAINT "FK_52887ec1634370e863b673b6dc0" FOREIGN KEY ("poItemId") REFERENCES "po_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acceptance_notes" ADD CONSTRAINT "FK_b498aae0097d308671a6d58feea" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipment_and_handlings" ADD CONSTRAINT "FK_fc0c88ea7f2653a4c9e6a4ed24a" FOREIGN KEY ("itemShipmentId") REFERENCES "item_shipments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_shipments" ADD CONSTRAINT "FK_097c32eeccfd0645b57d843b31c" FOREIGN KEY ("poItemId") REFERENCES "po_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_shipments" ADD CONSTRAINT "FK_b2bb7398d1cfebef780d8e3a7a1" FOREIGN KEY ("poShipmentId") REFERENCES "po_shipments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "po_shipments" ADD CONSTRAINT "FK_d3cbe034cf0d8853ea882e7815d" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_sources" ADD CONSTRAINT "FK_a8d29e7d5a4fd943f759e600703" FOREIGN KEY ("poItemId") REFERENCES "po_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attachments" ADD CONSTRAINT "FK_ee99c07f5697da622650624cafd" FOREIGN KEY ("poItemId") REFERENCES "po_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_receivers" ADD CONSTRAINT "FK_c54d5a3453ef013664cfb5d7dd8" FOREIGN KEY ("poItemId") REFERENCES "po_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_00feea4d2f086412bc2db24afaa" FOREIGN KEY ("poItemId") REFERENCES "po_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "po_items" ADD CONSTRAINT "FK_10df1a756b2adf320434dad2db4" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "receiving_items" ADD CONSTRAINT "FK_c1855094b6ad628b7e625b80a42" FOREIGN KEY ("receivingNoteId") REFERENCES "receiving_notes"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "receiving_items" ADD CONSTRAINT "FK_29ba482e6a1be42bf1bcef3a0f8" FOREIGN KEY ("poItemId") REFERENCES "po_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "receiving_attachments" ADD CONSTRAINT "FK_1781a62591b306f1e1a47371889" FOREIGN KEY ("receivingNoteId") REFERENCES "receiving_notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "receiving_notes" ADD CONSTRAINT "FK_c7934294597972f8a597a264295" FOREIGN KEY ("poShipmentId") REFERENCES "po_shipments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "receiving_notes" ADD CONSTRAINT "FK_49497badbb96b30c3200a967257" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acceptance_receives" ADD CONSTRAINT "FK_ea350b4cac819f57203cbafc69f" FOREIGN KEY ("acceptanceNoteId") REFERENCES "acceptance_notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acceptance_receives" ADD CONSTRAINT "FK_6fe753e487788e1fb8b7b099875" FOREIGN KEY ("receivingNoteId") REFERENCES "receiving_notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "acceptance_receives" DROP CONSTRAINT "FK_6fe753e487788e1fb8b7b099875"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acceptance_receives" DROP CONSTRAINT "FK_ea350b4cac819f57203cbafc69f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "receiving_notes" DROP CONSTRAINT "FK_49497badbb96b30c3200a967257"`,
    );
    await queryRunner.query(
      `ALTER TABLE "receiving_notes" DROP CONSTRAINT "FK_c7934294597972f8a597a264295"`,
    );
    await queryRunner.query(
      `ALTER TABLE "receiving_attachments" DROP CONSTRAINT "FK_1781a62591b306f1e1a47371889"`,
    );
    await queryRunner.query(
      `ALTER TABLE "receiving_items" DROP CONSTRAINT "FK_29ba482e6a1be42bf1bcef3a0f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "receiving_items" DROP CONSTRAINT "FK_c1855094b6ad628b7e625b80a42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "po_items" DROP CONSTRAINT "FK_10df1a756b2adf320434dad2db4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_00feea4d2f086412bc2db24afaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_receivers" DROP CONSTRAINT "FK_c54d5a3453ef013664cfb5d7dd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_attachments" DROP CONSTRAINT "FK_ee99c07f5697da622650624cafd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_budget_sources" DROP CONSTRAINT "FK_a8d29e7d5a4fd943f759e600703"`,
    );
    await queryRunner.query(
      `ALTER TABLE "po_shipments" DROP CONSTRAINT "FK_d3cbe034cf0d8853ea882e7815d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_shipments" DROP CONSTRAINT "FK_b2bb7398d1cfebef780d8e3a7a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_shipments" DROP CONSTRAINT "FK_097c32eeccfd0645b57d843b31c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipment_and_handlings" DROP CONSTRAINT "FK_fc0c88ea7f2653a4c9e6a4ed24a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acceptance_notes" DROP CONSTRAINT "FK_b498aae0097d308671a6d58feea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acceptance_items" DROP CONSTRAINT "FK_52887ec1634370e863b673b6dc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acceptance_items" DROP CONSTRAINT "FK_57b6e64587efdd756bcf34061ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_737c75977327c5451139a1ba4e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_attachments" DROP CONSTRAINT "FK_221ffa6d864a6305ec083f309e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_vouchers" DROP CONSTRAINT "FK_725be793bd66840f4e91ffaaccc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_vouchers" DROP CONSTRAINT "FK_468728bd809a72f015a75cde000"`,
    );
    await queryRunner.query(
      `ALTER TABLE "voucher_details" DROP CONSTRAINT "FK_e3e29ea8ede5ed0877a9a95043c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "voucher_details" DROP CONSTRAINT "FK_d6db24eeea9412e6558b3b3d7ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "po_terms" DROP CONSTRAINT "FK_ec32cb12beee670fb5277c05f0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "po_attachments" DROP CONSTRAINT "FK_1e49559d8b062375024c7cc9705"`,
    );
    await queryRunner.query(`DROP TABLE "acceptance_receives"`);
    await queryRunner.query(`DROP TABLE "receiving_notes"`);
    await queryRunner.query(`DROP TYPE "public"."receiving_notes_status_enum"`);
    await queryRunner.query(`DROP TABLE "receiving_attachments"`);
    await queryRunner.query(`DROP TABLE "receiving_items"`);
    await queryRunner.query(`DROP TYPE "public"."receiving_items_status_enum"`);
    await queryRunner.query(`DROP TABLE "po_items"`);
    await queryRunner.query(`DROP TYPE "public"."po_items_status_enum"`);
    await queryRunner.query(`DROP TABLE "invoice_items"`);
    await queryRunner.query(`DROP TABLE "item_receivers"`);
    await queryRunner.query(`DROP TABLE "item_attachments"`);
    await queryRunner.query(`DROP TABLE "item_budget_sources"`);
    await queryRunner.query(`DROP TABLE "purchase_orders"`);
    await queryRunner.query(`DROP TYPE "public"."purchase_orders_status_enum"`);
    await queryRunner.query(`DROP TABLE "po_shipments"`);
    await queryRunner.query(`DROP TYPE "public"."po_shipments_status_enum"`);
    await queryRunner.query(`DROP TABLE "item_shipments"`);
    await queryRunner.query(`DROP TABLE "shipment_and_handlings"`);
    await queryRunner.query(`DROP TABLE "acceptance_notes"`);
    await queryRunner.query(
      `DROP TYPE "public"."acceptance_notes_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "acceptance_items"`);
    await queryRunner.query(
      `DROP TYPE "public"."acceptance_items_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`);
    await queryRunner.query(`DROP TABLE "invoice_attachments"`);
    await queryRunner.query(`DROP TABLE "payment_vouchers"`);
    await queryRunner.query(
      `DROP TYPE "public"."payment_vouchers_paymentstatus_enum"`,
    );
    await queryRunner.query(`DROP TABLE "voucher_details"`);
    await queryRunner.query(`DROP TABLE "po_terms"`);
    await queryRunner.query(`DROP TABLE "po_attachments"`);
  }
}

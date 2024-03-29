import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelationOfInstance1711703024077
  implements MigrationInterface
{
  name = 'ChangeRelationOfInstance1711703024077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_09422b1afb67285d2d7e06af1f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "FK_0f669cd17eabf7232c5466d8ecf"`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_invoices" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "applicationKey" character varying NOT NULL, "amount" numeric(14,2) NOT NULL, "currency" character varying NOT NULL, "invoiceReference" character varying NOT NULL, "sessionId" character varying NOT NULL, "orderId" character varying NOT NULL, "notificationUrl" character varying NOT NULL, "callbackUrl" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "UQ_a926ccdcd8e075d3c9b572a2ba9" UNIQUE ("invoiceReference"), CONSTRAINT "UQ_efaa7ebbcfb3be0fdf32173da8f" UNIQUE ("sessionId"), CONSTRAINT "UQ_080ddf1630c5ecc8098ce04cde5" UNIQUE ("orderId"), CONSTRAINT "PK_41d5ecc2ca516ca9c179f0f0065" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "stepId"`);
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP COLUMN "ruleDesignerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "instanceStepId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD "designerId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD "key" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "stateId"`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "stateId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "UQ_c5218b7eead88f9ed5329deea5c" UNIQUE ("stateId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "UQ_de333f741602ac65257708c30d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "UQ_59ada20b6a7bc62a73d0626dbdb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "UQ_bb8cd8789b1ab55064e743b8765" UNIQUE ("reason", "designerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "UQ_f2ce86bfe9dbf7eade88605a803" UNIQUE ("key", "designerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_a6cffc72cfb0959f7adf95e076a" FOREIGN KEY ("instanceStepId") REFERENCES "instance_steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_c5218b7eead88f9ed5329deea5c" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "FK_ed7b12726835d030e1976a7adad" FOREIGN KEY ("designerId") REFERENCES "rule_designer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "FK_ed7b12726835d030e1976a7adad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_c5218b7eead88f9ed5329deea5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_a6cffc72cfb0959f7adf95e076a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "UQ_f2ce86bfe9dbf7eade88605a803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "UQ_bb8cd8789b1ab55064e743b8765"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "UQ_59ada20b6a7bc62a73d0626dbdb" UNIQUE ("key")`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "UQ_de333f741602ac65257708c30d4" UNIQUE ("reason")`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "UQ_c5218b7eead88f9ed5329deea5c"`,
    );
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "stateId"`);
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "stateId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "key"`);
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP COLUMN "designerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP COLUMN "instanceStepId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD "ruleDesignerId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "instances" ADD "stepId" uuid`);
    await queryRunner.query(`DROP TABLE "payment_invoices"`);
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "FK_0f669cd17eabf7232c5466d8ecf" FOREIGN KEY ("ruleDesignerId") REFERENCES "rule_designer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_09422b1afb67285d2d7e06af1f2" FOREIGN KEY ("stepId") REFERENCES "steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

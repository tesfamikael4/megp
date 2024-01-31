import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationUpdtade1706686993513 implements MigrationInterface {
  name = 'NotificationUpdtade1706686993513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('EMAIL', 'MESSAGE', 'INBOX')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_status_enum" AS ENUM('SUCCEED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."notifications_type_enum" NOT NULL, "application" character varying NOT NULL, "subject" character varying NOT NULL, "detailContent" character varying NOT NULL, "shortContent" character varying NOT NULL, "receiver" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "cc" text NOT NULL, "status" "public"."notifications_status_enum" NOT NULL, "errorMessage" character varying, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
  }
}

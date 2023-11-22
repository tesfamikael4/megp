import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnSecurityQuestions1700644359562
  implements MigrationInterface
{
  name = 'UpdateOnSecurityQuestions1700644359562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "security_questions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "answer" character varying NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_40863dac02e72e1ea928b07d5ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_questions" ADD CONSTRAINT "FK_9d52a346395912db63f87a519f7" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "security_questions" DROP CONSTRAINT "FK_9d52a346395912db63f87a519f7"`,
    );
    await queryRunner.query(`DROP TABLE "security_questions"`);
  }
}

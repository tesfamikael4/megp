import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkWithIAM1710759369488 implements MigrationInterface {
  name = '1710759369488-LinkWithIAM';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS postgres_fdw;

        CREATE SERVER IF NOT EXISTS iam_server 
        FOREIGN DATA WRAPPER postgres_fdw
            OPTIONS (host '196.189.44.10', port '5432', dbname 'dev_iam');
        
        CREATE USER MAPPING IF NOT EXISTS FOR postgres
        SERVER iam_server
        OPTIONS (user 'postgres', password 'Megp7890)(*&');

        CREATE FOREIGN TABLE IF NOT EXISTS external_organizations (
            id UUID,
            name TEXT
        )
        SERVER iam_server
        OPTIONS (schema_name 'public', table_name 'organizations');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP FOREIGN TABLE external_organizations;

        DROP USER MAPPING FOR postgres SERVER iam_server;

        DROP SERVER iam_server;

        DROP EXTENSION postgres_fdw;
        `);
  }
}

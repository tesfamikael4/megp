import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config({ path: '.env' });

export const TypeOrmConfigHelper = {
  DATABASE_HOST: process.env.DATABASE_HOST ?? 'localhost',
  DATABASE_PORT: process.env.DATABASE_PORT ?? '5433',
  DATABASE_NAME: process.env.DATABASE_NAME ?? 'vendor_dev03',
  DATABASE_USER: process.env.DATABASE_USER ?? 'postgres',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? 'root',
};

const pathPrefix =
  process.env.NODE_ENV === 'production' ? 'apps/server/vendor-be/' : '';
export const dataSourceOptions = {
  type: 'postgres',
  host: TypeOrmConfigHelper.DATABASE_HOST,
  port: Number(TypeOrmConfigHelper.DATABASE_PORT),
  database: TypeOrmConfigHelper.DATABASE_NAME,
  username: TypeOrmConfigHelper.DATABASE_USER,
  password: TypeOrmConfigHelper.DATABASE_PASSWORD,
  entities: [`${pathPrefix}dist/**/*.entity.{ts,js}`],
  migrations: [`${pathPrefix}dist/migrations/*.{ts,js}`],
  migrationsRun: true,
  seeds: [`${pathPrefix}dist/modules/seeders/**.seeder.{ts,js}`],
  migrationsTableName: 'typeorm_migrations',
  logger: 'advanced-console',
  logging: 'all',
  synchronize: false,
  autoLoadEntities: true,
} as DataSourceOptions & SeederOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

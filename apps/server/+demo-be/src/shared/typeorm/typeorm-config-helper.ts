import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config({ path: '.env' });

export const TypeOrmConfigHelper = {
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,
};

export const dataSourceOptions = {
  type: 'postgres',
  host: TypeOrmConfigHelper.DATABASE_HOST,
  port: Number(TypeOrmConfigHelper.DATABASE_PORT),
  database: TypeOrmConfigHelper.DATABASE_NAME,
  username: TypeOrmConfigHelper.DATABASE_USER,
  password: TypeOrmConfigHelper.DATABASE_PASSWORD,
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  migrationsRun: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
  migrationsTableName: 'typeorm_migrations',
  // logger: 'advanced-console',
  // logging: 'all',
  synchronize: true, // TypeOrmConfigHelper.NODE_ENV != 'production', // never use TRUE in production!
  autoLoadEntities: true, // TypeOrmConfigHelper.NODE_ENV != 'production',
} as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

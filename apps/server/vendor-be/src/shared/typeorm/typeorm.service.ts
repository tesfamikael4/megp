import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmConfigHelper } from './typeorm-config-helper';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: TypeOrmConfigHelper.DATABASE_HOST,
      port: Number(TypeOrmConfigHelper.DATABASE_PORT),
      database: TypeOrmConfigHelper.DATABASE_NAME,
      username: TypeOrmConfigHelper.DATABASE_USER,
      password: TypeOrmConfigHelper.DATABASE_PASSWORD,
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      // logger: 'advanced-console',
      // logging: 'all',
      synchronize: true, // TypeOrmConfigHelper.NODE_ENV != 'production', // never use TRUE in production!
      autoLoadEntities: true, // TypeOrmConfigHelper.NODE_ENV != 'production',
    };
  }
}

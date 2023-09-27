import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { OrganizationModule } from './organization';
import { AuthenticationModule } from './supertokens';
import { GroupModule } from './groups/group.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthenticationModule,
    OrganizationModule,
    GroupModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

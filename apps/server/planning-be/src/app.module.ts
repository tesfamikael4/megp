import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthorizationModule } from './authorization';
import { PrebudgetModule } from './prebudget/prebudget.module';
import { ItemMasterModule } from './item-master/item-master.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthorizationModule,
    ItemMasterModule,
    PrebudgetModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}

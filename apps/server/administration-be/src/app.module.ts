import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { ItemMasterModule } from './modules/item-master/item-master.module';
import { lookUpDataModule } from './modules/look-up-data/look-up.module';
import { ClassificationModule } from './modules/classification/classification.module';
import { AuthorizationModule } from './shared/authorization/authorization.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ClassificationModule,
    lookUpDataModule,
    ItemMasterModule,
    AuthorizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

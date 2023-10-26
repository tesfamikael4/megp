import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { TodoModule } from './todo/todo.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ItemMasterModule } from './modules/item-master/item-master.module';
import { lookUpDataModule } from './modules/look-up-data/look-up.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    lookUpDataModule,

    ItemMasterModule,

    TodoModule,
    AuthorizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { TodoModule } from './modules/todo/todo.module';
import { AuthorizationModule } from './shared/authorization';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TodoModule,
    AuthorizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

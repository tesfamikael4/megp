import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthorizationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthorizationModule,
    WorkflowModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}

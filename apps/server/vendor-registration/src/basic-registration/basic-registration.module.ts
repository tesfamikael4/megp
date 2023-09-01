import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SecurityQuestion } from './entities/security-question.entity';
import { BasicRegistration } from './entities/basic-registration.entity';
import { BasicRegistrationController } from './basic-registration.controller';
import { BasicRegistrationService } from './basic-registration.service';

@Module({
  imports: [TypeOrmModule.forFeature([BasicRegistration, SecurityQuestion])],
  providers: [BasicRegistrationService],
  controllers: [BasicRegistrationController],
  exports: [BasicRegistrationService],
})
export class BasicRegistrationModule { }
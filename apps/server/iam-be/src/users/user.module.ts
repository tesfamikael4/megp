import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SecurityQuestion } from './entities/security-question.entity';
import { UserService } from './services/user.service';
import { SecurityQuestionService } from './services/security-question.service';
import { UserAuthService } from './services/user-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, SecurityQuestion])],
  controllers: [],
  providers: [UserService, SecurityQuestionService, UserAuthService],
  exports: [UserAuthService],
})
export class UserModule {}

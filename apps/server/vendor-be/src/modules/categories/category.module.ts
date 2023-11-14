import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { AuthorizationModule } from 'src/shared/authorization';
import { Category } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthorizationModule],
  providers: [CategoryService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}

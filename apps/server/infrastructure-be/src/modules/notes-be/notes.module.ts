import { Module } from '@nestjs/common';
import { NotesService } from './service/notes.service';
import { NotesController } from './controller/notes.controller';
import { Notes } from 'src/entities/note.entity';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Notes])],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}

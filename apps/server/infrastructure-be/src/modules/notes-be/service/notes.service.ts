import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notes } from 'src/entities/note.entity';
import { EntityCrudService } from 'megp-shared-be';
import { TreeRepository } from 'typeorm';

@Injectable()
export class NotesService extends EntityCrudService<Notes> {
  constructor(
    @InjectRepository(Notes)
    private readonly repositoryNotes: TreeRepository<Notes>,
  ) {
    super(repositoryNotes);
  }

  async getNote(objectId: string) {
    return await this.repositoryNotes.find({
      where: {
        objectId,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        parent: true,
      },
    });
  }

  async getNotesWithVersion(objectId: string, version: string) {
    return await this.repositoryNotes.find({
      where: {
        objectId,
        metaData: {
          version,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        parent: true,
      },
    });
  }
}

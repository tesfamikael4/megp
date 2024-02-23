import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { SorDocument } from 'src/entities/sor-document.entity';
import { SorDocumentService } from '../service/sor-document.service';
import {
  CreateSorDocumentDto,
  UpdateSorDocumentDto,
} from '../dto/sor-document.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateSorDocumentDto,
  updateDto: UpdateSorDocumentDto,
};

@ApiBearerAuth()
@Controller('sor-documents')
@ApiTags('Sor Document Controller')
export class SorDocumentController extends ExtraCrudController<SorDocument>(
  options,
) {
  constructor(private readonly sorDocumentService: SorDocumentService) {
    super(sorDocumentService);
  }
}

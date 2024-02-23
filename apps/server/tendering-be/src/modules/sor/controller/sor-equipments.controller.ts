import { SorEquipment } from 'src/entities/sor-equipment.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { SorEquipmentService } from '../service/sor-equipment.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateSorEquipmentsDto,
  UpdateSorEquipmentsDto,
} from '../dto/sor-equipments.dto';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateSorEquipmentsDto,
  updateDto: UpdateSorEquipmentsDto,
};

@ApiBearerAuth()
@Controller('sor-equipments')
@ApiTags('Sor Equipments Controller')
export class SorEquipmentController extends ExtraCrudController<SorEquipment>(
  options,
) {
  constructor(private readonly sorEquipmentService: SorEquipmentService) {
    super(sorEquipmentService);
  }
}

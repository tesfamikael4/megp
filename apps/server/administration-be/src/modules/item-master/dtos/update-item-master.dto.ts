import { ApiProperty } from '@nestjs/swagger';
import { CreateItemMasterDto } from './create-item-master.dto';
import { IsBoolean, IsUUID } from 'class-validator';
import { ItemMaster } from 'src/entities/item-master.entity';
export class UpdateItemMasterDto extends CreateItemMasterDto {
  @ApiProperty({
    format: 'uuid',
    required: true,
  })
  @IsUUID()
  id: string;
  @ApiProperty({ required: true })
  @IsBoolean()
  isActive: boolean;

  static fromDto(dto: UpdateItemMasterDto): ItemMaster {
    const entity: ItemMaster = {
      ...super.fromDto(dto),
      id: dto.id,
      isActive: dto.isActive,
    };
    return entity;
  }
  static toDto(entity: ItemMaster): UpdateItemMasterDto {
    const dto: UpdateItemMasterDto = {
      ...super.toDto(entity),
      id: entity.id,
      isActive: entity.isActive,
    };
    return dto;
  }
  static toDtos(items: ItemMaster[]) {
    return items?.map((item) => this.toDto(item));
  }
}

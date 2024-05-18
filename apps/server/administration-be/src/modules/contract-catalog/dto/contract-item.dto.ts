import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsUUID, IsNumber, Min } from 'class-validator';
import { ContractItemStatus } from 'src/shared/enums/contract-catalog-enum';

export class CreateContractItemDto {
  @ApiProperty()
  @IsUUID()
  contractCatalogId: string;

  @ApiProperty()
  @IsUUID()
  itemMasterId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  maximumQuantity: number;

  @ApiProperty({ default: 0 })
  utilizedQuantity: number;

  @ApiProperty()
  specification: any;

  @ApiProperty({ enum: ContractItemStatus })
  @IsEnum(ContractItemStatus, {
    message: `Contract Catalog Item Status must be one of the following values: 
    ${Object.values(ContractItemStatus).join(', ')}`,
  })
  status: ContractItemStatus;
}

export class UpdateContractItemDto extends CreateContractItemDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

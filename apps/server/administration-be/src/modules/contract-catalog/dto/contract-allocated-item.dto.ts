import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsNumber, Min } from 'class-validator';
import { ContractItemStatus } from 'src/shared/enums/contract-catalog-enum';

export class CreateContractAllocatedItemDto {
  @ApiProperty()
  @IsUUID()
  contractItemId: string;

  @ApiProperty()
  @IsUUID()
  itemMasterId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  maximumQuantityAllowed: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  utilizedQuantity: number;

  @ApiProperty({ enum: ContractItemStatus })
  @IsEnum(ContractItemStatus, {
    message: `Contract allocated Item Status must be one of the following values: 
    ${Object.values(ContractItemStatus).join(', ')}`,
  })
  status: ContractItemStatus;
}
export class UpdateContractAllocatedItemDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

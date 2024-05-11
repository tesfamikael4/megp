import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { ContractCatalogStatus } from 'src/shared/enums/contract-catalog-enum';

export class CreateContractCatalogDTO {
  @ApiProperty()
  organization: any;

  @ApiProperty()
  vendor: any;

  @ApiProperty()
  @IsNotEmpty()
  contractReferenceNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  contractTitle: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ enum: ContractCatalogStatus })
  @IsEnum(ContractCatalogStatus, {
    message: `Contract Catalog Status must be one of the following values: 
    ${Object.values(ContractCatalogStatus).join(', ')}`,
  })
  status: ContractCatalogStatus;
}

export class UpdateContractCatalogDTO extends CreateContractCatalogDTO {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}

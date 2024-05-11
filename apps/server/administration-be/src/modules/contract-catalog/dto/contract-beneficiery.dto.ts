import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ContractBeneficiaryStatus } from 'src/shared/enums/contract-catalog-enum';

export class CreateContractBeneficiaryDto {
  @ApiProperty()
  organization: any;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  contractCatalogId: string;

  @ApiProperty({ enum: ContractBeneficiaryStatus })
  @IsOptional()
  @IsEnum(ContractBeneficiaryStatus, {
    message: `Contract Beneficiary Status must be one of the following values: 
    ${Object.values(ContractBeneficiaryStatus).join(', ')}`,
  })
  status: ContractBeneficiaryStatus;
}
export class UpdateContractBeneficiaryDto extends CreateContractBeneficiaryDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class Organization {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  shortName: string;

  @ApiProperty()
  @IsString()
  code: string;
}
export class BulkCreateContractBeneficiaryDto extends CreateContractBeneficiaryDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  contractCatalogId: string;

  @ApiProperty({ type: () => Organization })
  organizations: Organization[];
}
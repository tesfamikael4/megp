import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import {
  BusinessCategoryResponseDto,
  CreateBusinessCategoryDto,
} from './business-category.dto';
import {
  CreateCustomCategoryDto,
  CustomCategoryResponseDto,
} from './custom-category.dto';
import {
  CreateShareholdersDto,
  ShareholdersResponseDto,
} from './shareholder.dto';
import { BankAccountDetailResponse } from './bank-account-detail.dto';
import { BeneficialOwnershipResponse } from './beneficial-ownership.dto';
import {
  AreasOfBusinessInterestResponse,
  CreateAreasOfBusinessInterest,
} from './areas-of-business-interest';
import { VendorsEntity } from 'src/entities';
import { CreateWorkflowInstanceDto } from 'src/modules/handling/dto/workflow-instance.dto';

export class CreateVendorsDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  tin: string;
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  //legal form of entity
  @ApiProperty()
  @IsNotEmpty()
  formOfEntity: string;
  @ApiProperty()
  @IsNotEmpty()
  country: string;
  @ApiProperty()
  @IsNotEmpty()
  metaData: JSON;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  district: string;

  @ApiProperty()
  @IsNotEmpty()
  origin: string;

  @ApiProperty()
  commonCategories: CreateBusinessCategoryDto[];
  @ApiProperty()
  customCategories: CreateCustomCategoryDto[];

  appliactions: CreateWorkflowInstanceDto[];
  @ApiProperty()
  shareholders: ShareholdersResponseDto[];
  BeneficialOwnershipResponse;

  @ApiProperty()
  bankAccountDetail: BankAccountDetailResponse[];

  @ApiProperty()
  beneficialOwnership: BeneficialOwnershipResponse[];

  @ApiProperty()
  areasOfBusinessInterest: AreasOfBusinessInterestResponse[];

  static fromDto(dto: CreateVendorsDto): VendorsEntity {
    const entity = new VendorsEntity();
    if (!dto) {
      return;
    }
    entity.id = dto?.id;
    entity.tin = dto.tin;
    entity.country = dto.country;
    entity.formOfEntity = dto.formOfEntity;
    entity.status = dto.status;
    entity.userId = dto.userId;

    entity.district = dto.district;
    entity.name = dto.name;
    entity.origin = dto.origin;

    entity.metaData = dto.metaData;
    entity.businessCats = dto.commonCategories
      ? dto.commonCategories.map((item) =>
          CreateBusinessCategoryDto.fromDto(item),
        )
      : null;
    entity.customCats = dto.customCategories
      ? dto.customCategories.map((item) =>
          CreateCustomCategoryDto.fromDto(item),
        )
      : null;

    entity.instances = dto.appliactions
      ? dto.appliactions.map((item) => CreateWorkflowInstanceDto.fromDto(item))
      : null;

    entity.shareholders = dto.shareholders
      ? dto.shareholders.map((item) => CreateShareholdersDto.fromDto(item))
      : null;
    entity.areasOfBusinessInterest = dto.areasOfBusinessInterest
      ? dto.areasOfBusinessInterest.map((item) =>
          CreateAreasOfBusinessInterest.fromDto(item),
        )
      : null;
    return entity;
  }
}
export class UpdateVendorsDto extends CreateVendorsDto {
  @ApiProperty()
  @IsUUID()
  id: string;
  static fromDto(dto: UpdateVendorsDto): VendorsEntity {
    const entity = new VendorsEntity();
    if (!dto) {
      return;
    }
    entity.id = dto.id;
    entity.tin = dto.tin;
    entity.userId = dto.userId;
    entity.country = dto.country;
    entity.formOfEntity = dto.status;
    entity.metaData = dto.metaData;
    entity.district = dto.district;
    entity.name = dto.name;
    entity.origin = dto.origin;
    return entity;
  }
}
export class VendorsResponseDto extends UpdateVendorsDto {
  static fromEntity(entity: VendorsEntity): VendorsResponseDto {
    vendor: VendorsResponseDto;
    const response = new VendorsResponseDto();
    response.id = entity.id;
    response.tin = entity.tin;
    response.userId = entity.userId;
    response.country = entity.country;
    response.name = entity.name;
    response.status = entity.status;
    response.metaData = entity.metaData;
    response.district = entity.district;
    response.name = entity.name;
    response.origin = entity.origin;

    response.shareholders = entity?.shareholders?.map((element) =>
      ShareholdersResponseDto.fromEntity(element),
    );
    response.bankAccountDetail = entity?.vendorAccounts?.map((element) =>
      BankAccountDetailResponse.fromEntity(element),
    );
    response.beneficialOwnership = entity?.beneficialOwnership?.map((element) =>
      BeneficialOwnershipResponse.fromEntity(element),
    );
    response.areasOfBusinessInterest = entity?.areasOfBusinessInterest?.map(
      (element) => AreasOfBusinessInterestResponse.fromEntity(element),
    );
    if (entity.businessCats)
      response.commonCategories = entity.businessCats.map((item) =>
        BusinessCategoryResponseDto.toResponse(item),
      );
    if (entity.customCats)
      response.customCategories = entity.customCats.map((item) =>
        CustomCategoryResponseDto.toResponse(item),
      );

    return response;
  }
}
// enum STATUS {
//   'Save as Draft',
//   'SUBMITTED',
//   'APPROVED',
// }
export class SetVendorStatus {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  @ApiProperty()
  // @IsNotEmpty()
  remark: string;
}
export class VendorInitiationBody {
  @ApiProperty()
  @IsNotEmpty()
  TinNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  Country: string;
  @ApiProperty()
  @IsNotEmpty()
  companyName: string;
  @ApiProperty()
  @IsNotEmpty()
  legalFormofEntity: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import {
  CreateBusinessCategoryDto,
} from './business-category.dto';

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
  countryOfRegistration: string;
  @ApiProperty()
  canRequest: true;
  @ApiProperty()
  commonCategories: CreateBusinessCategoryDto[];


  appliactions: CreateWorkflowInstanceDto[];



  @ApiProperty()
  areasOfBusinessInterest: AreasOfBusinessInterestResponse[];

  static fromDto(dto: CreateVendorsDto): VendorsEntity {
    const entity = new VendorsEntity();
    if (!dto) {
      return;
    }
    entity.id = dto?.id;

    entity.formOfEntity = dto.formOfEntity;
    entity.status = dto.status;
    entity.userId = dto.userId;

    entity.district = dto.district;
    entity.name = dto.name;
    entity.countryOfRegistration = dto.countryOfRegistration;

    entity.metaData = dto.metaData;



    entity.instances = dto.appliactions
      ? dto.appliactions.map((item) => CreateWorkflowInstanceDto.fromDto(item))
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
    entity.tinNumber = dto.tin;
    entity.userId = dto.userId;
    entity.formOfEntity = dto.status;
    entity.metaData = dto.metaData;
    entity.district = dto.district;
    entity.name = dto.name;
    entity.countryOfRegistration = dto.countryOfRegistration;
    return entity;
  }
}
export class VendorsResponseDto extends UpdateVendorsDto {
  static fromEntity(entity: VendorsEntity): VendorsResponseDto {
    vendor: VendorsResponseDto;
    const response = new VendorsResponseDto();
    response.id = entity.id;
    response.tin = entity.tinNumber;
    response.userId = entity.userId;
    response.name = entity.name;
    response.status = entity.status;
    response.metaData = entity.metaData;
    response.district = entity.district;
    response.name = entity.name;
    response.countryOfRegistration = entity.countryOfRegistration;
    response.areasOfBusinessInterest = entity?.areasOfBusinessInterest?.map(
      (element) => AreasOfBusinessInterestResponse.fromEntity(element),
    );


    return response;
  }
}
export class SetVendorStatus {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  isrVendorId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  instanceId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;
  @ApiProperty()
  @IsNotEmpty()
  status: string;
  @ApiProperty()
  @IsNotEmpty()
  remark: string;
  @ApiProperty()
  category: string;
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

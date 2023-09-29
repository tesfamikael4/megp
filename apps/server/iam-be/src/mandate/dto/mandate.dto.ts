import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsDateString, IsArray, IsObject, IsOptional } from 'class-validator';
import { Mandate } from '../entities/mandate.entity';
       

export class CreateMandateDto {
     
  @ApiProperty()
  @IsString()
  name: string;
    
  @ApiProperty()
  @IsString()
  description: string;
    
  @ApiProperty()
  @IsString()
  key: string;
    
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
    
  @ApiProperty()
  @IsString()
  versionNo: string;
    
  @ApiProperty()
  @IsBoolean()
  isSingleAssignment: boolean;
     
  static fromDto(mandateDto: CreateMandateDto): Mandate {
    const mandate: Mandate = new Mandate();  
    if (!mandateDto) {
      return;
    }
    mandate.name = mandateDto.name;
      
    mandate.description = mandateDto.description;
      
    mandate.key = mandateDto.key;
      
    mandate.isActive = mandateDto.isActive;
      
    mandate.versionNo = mandateDto.versionNo;
      
    mandate.isSingleAssignment = mandateDto.isSingleAssignment;
      
 
 
    return mandate;
  }

  static fromDtos(mandateDto: CreateMandateDto[]) {
    return mandateDto?.map(mandate => CreateMandateDto.fromDto(mandate));
  }
}


export class UpdateMandateDto extends CreateMandateDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(mandateDto: UpdateMandateDto): Mandate {
    const mandate: Mandate = new Mandate();  
    if (!mandateDto) {
      return;
    }
    mandate.id = mandateDto.id;
      
    mandate.name = mandateDto.name;
      
    mandate.description = mandateDto.description;
      
    mandate.key = mandateDto.key;
      
    mandate.isActive = mandateDto.isActive;
      
    mandate.versionNo = mandateDto.versionNo;
      
    mandate.isSingleAssignment = mandateDto.isSingleAssignment;
      
 
 
    return mandate;
  }
}

export class MandateResponseDto extends UpdateMandateDto {

  static toDto(mandate:Mandate): MandateResponseDto {
    const mandateDto: MandateResponseDto = new MandateResponseDto();  
 
    mandateDto.id = mandate.id; 
 
    mandateDto.name = mandate.name; 
 
    mandateDto.description = mandate.description; 
 
    mandateDto.key = mandate.key; 
 
    mandateDto.isActive = mandate.isActive; 
 
    mandateDto.versionNo = mandate.versionNo; 
 
    mandateDto.isSingleAssignment = mandate.isSingleAssignment; 
          
    return mandateDto;
  }

  static toDtos(mandates:Mandate[]) {
    return mandates?.map(mandate => MandateResponseDto.toDto(mandate));
  }
}
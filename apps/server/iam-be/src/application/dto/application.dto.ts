import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsDateString, IsArray, IsObject, IsOptional } from 'class-validator';
import { Application } from '../entities/application.entity';
    

export class CreateApplicationDto {
     
  @ApiProperty()
  @IsString()
  name: string;
    
  @ApiProperty()
  @IsString()
  description: string;
     
  static fromDto(applicationDto: CreateApplicationDto): Application {
    const application: Application = new Application();  
    if (!applicationDto) {
      return;
    }
    application.name = applicationDto.name;
      
    application.description = applicationDto.description;
      
 
    return application;
  }

  static fromDtos(applicationDto: CreateApplicationDto[]) {
    return applicationDto?.map(application => CreateApplicationDto.fromDto(application));
  }
}


export class UpdateApplicationDto extends CreateApplicationDto {
  @ApiProperty()
  @IsString()
  id: string;

  static fromDto(applicationDto: UpdateApplicationDto): Application {
    const application: Application = new Application();  
    if (!applicationDto) {
      return;
    }
    application.id = applicationDto.id;
      
    application.name = applicationDto.name;
      
    application.description = applicationDto.description;
      
 
    return application;
  }
}

export class ApplicationResponseDto extends UpdateApplicationDto {

  static toDto(application:Application): ApplicationResponseDto {
    const applicationDto: ApplicationResponseDto = new ApplicationResponseDto();  
 
    applicationDto.id = application.id; 
 
    applicationDto.name = application.name; 
 
    applicationDto.description = application.description; 
       
    return applicationDto;
  }

  static toDtos(applications:Application[]) {
    return applications?.map(application => ApplicationResponseDto.toDto(application));
  }
}
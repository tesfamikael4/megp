
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
export class BriefCaseDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    @IsOptional()
    description: string;
    @ApiProperty()
    @IsOptional()
    name: string

}

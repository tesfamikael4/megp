import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, ValidateNested, isNotEmpty, isObject } from "class-validator";

export class PPDARegistrationDataDto {
    @ApiProperty()
    @IsNotEmpty()
    category: string;
    @ApiProperty()
    @IsNotEmpty()
    priceRange: string;
    @ApiProperty()
    @IsOptional()
    userType: string;//Contractor, Consultant
    @ApiProperty()
    @IsOptional()
    classification: string; // Classification of Contractor or consultants
    @ApiProperty()
    @IsOptional()
    expiryDate: Date;
    @ApiProperty()
    @IsOptional()
    ncicRegistrationNumber: string;
    @ApiProperty()
    @IsOptional()
    ncicRegistrationDate: Date;

}


export class BusinessInterestAreaDto {
    @ApiProperty({ type: [PPDARegistrationDataDto] })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => PPDARegistrationDataDto)
    areasOfBusinessInterest: PPDARegistrationDataDto[];
    @ApiProperty()
    @IsOptional()
    ppdaRegistrationNumber: string;
    @ApiProperty()
    @IsOptional()
    ppdaRegistrationDate: Date;
    @ApiProperty()
    @IsOptional()
    expiryDate: Date;
    @ApiProperty()
    @IsNotEmpty()
    lineOfBusiness: any[]
}
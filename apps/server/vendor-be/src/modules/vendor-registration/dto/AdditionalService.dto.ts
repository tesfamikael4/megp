import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, ValidateNested, isNotEmpty, isObject } from "class-validator";

export class PPDARegistrationDataDto {
    @ApiProperty()
    @IsNotEmpty()
    category: string;
    @ApiProperty()
    @IsNotEmpty()
    priceRange: string;
    @ApiProperty()
    userType: string;//Contractor, Consultant
    @ApiProperty()
    classification: string; // Classification of Contractor or consultants
    @ApiProperty()
    expiryDate: Date;
    @ApiProperty()
    ncicRegistrationNumber: string;
    @ApiProperty()
    ncicRegistrationDate: Date;

}


export class BusinessInterestAreaDto {
    @ApiProperty()
    @IsNotEmpty()
    @ValidateNested()
    areasOfBusinessInterest: PPDARegistrationDataDto[];
    @IsOptional()
    ppdaRegistrationNumber: string;
    @IsOptional()
    ppdaRegistrationDate: Date;
    @IsOptional()
    expiryDate: Date;
    @IsNotEmpty()
    lineOfBusiness: any[]
}
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";

export class VendorUpgradeDto {
    @ApiProperty()
    @IsNotEmpty()
    id: string
    @ApiProperty()
    @IsNotEmpty()
    pricingId: string
    @ApiProperty()
    @IsNotEmpty()
    category: string
}

export class UpgradeInfoDTO {
    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => VendorUpgradeDto)
    upgrades: VendorUpgradeDto[];
    @ApiProperty()
    @IsNotEmpty()
    BusinessAreaStatus: any

}



import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateNotifcationDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: string;
    @ApiProperty()
    @IsNotEmpty()
    title: string;
    @ApiProperty()
    @IsNotEmpty()
    content: string;
    @ApiProperty()
    @IsOptional()
    status: string;


}
export class UpdateNotifcationDto extends CreateNotifcationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    id: string
}
export class NotifcationResponseDto extends UpdateNotifcationDto {
    @ApiProperty()
    status: string
}

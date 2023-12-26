import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUserPreferenceDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: boolean;
    @ApiProperty()
    @IsNotEmpty()

    emailNotifications: boolean;
    @ApiProperty()
    @IsNotEmpty()

    smsNotifications: boolean;
    @ApiProperty()
    @IsNotEmpty()
    pushNotifications: boolean;
}
export class UpdateUserPreferenceDto {
    @ApiProperty()
    @IsNotEmpty()
    id: string;
}
export class UserPreferenceResponseDto extends UpdateUserPreferenceDto {

}

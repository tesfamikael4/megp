import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  public username: string;

  @ApiProperty()
  @IsNotEmpty()
  public password: string;
}

export class GoogleLogin {
  @ApiProperty()
  @IsNotEmpty()
  public token: string;
}

export class LoginResponseDto {
  @ApiProperty()
  public is_security_question_set?: boolean;
  @ApiProperty()
  public access_token: string;
  @ApiProperty()
  public refresh_token?: string;
}

export class UserInfoDto {
  public access_token: string;
}

export class ForgetPasswordDto {
  @ApiProperty()
  @IsEmail()
  public email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  public verificationId: string;

  @ApiProperty()
  @IsString()
  public otp: string;

  @ApiProperty()
  @IsNotEmpty()
  public password: string;

  @ApiProperty()
  @IsBoolean()
  public isOtp: boolean;
}

export class AcceptAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  public verificationId: string;

  @ApiProperty()
  @IsString()
  public otp: string;

  @ApiProperty()
  @IsBoolean()
  public isOtp: boolean;
}

export class ChangePasswordDto {
  public accountId: string;

  @ApiProperty()
  @IsNotEmpty()
  public oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  public newPassword: string;
}

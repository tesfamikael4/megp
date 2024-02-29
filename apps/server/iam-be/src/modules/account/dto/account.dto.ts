import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  public firstName: string;

  @ApiProperty()
  @IsString()
  public lastName: string;

  @ApiProperty()
  @IsString()
  public phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(Number(process.env.PASSWORD_LENGTH ?? 8))
  public password: string;
}

export class VerifyAccountDto {
  @ApiProperty()
  @IsString()
  public verificationId: string;

  @ApiProperty()
  @IsString()
  public otp: string;

  @ApiProperty()
  @IsBoolean()
  public isOtp: boolean;
}

export class ResendOtpDto {
  @ApiProperty()
  @IsString()
  public verificationId: string;
}

export class UpdateAccountDto {
  @ApiProperty()
  @IsString()
  public firstName: string;

  @ApiProperty()
  @IsString()
  public lastName: string;
}

export class UpdateAccountProfileDto {
  @ApiProperty()
  @IsObject()
  public extendedProfile: any;
}

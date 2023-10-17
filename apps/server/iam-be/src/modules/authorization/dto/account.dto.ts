import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
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
  @MinLength(+process.env.PASS ?? 8)
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

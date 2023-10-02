import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ContactNumber } from '../entities/contact-number';
export class ContactNumberCommand {
  @ApiProperty()
  @IsString()
  @IsOptional()
  code!: string;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  number!: string;
  /**
   *A method that maps  contactNumberCommand object data to  contactNumber domain object
   *@returns contactNumber domain object which contains contactNumber  information
   */
  static fromCommands(
    contactNumberCommand: ContactNumberCommand,
  ): ContactNumber {
    const contactNumber: ContactNumber = new ContactNumber();
    contactNumber.code = contactNumberCommand.code;
    contactNumber.number = contactNumberCommand.number;
    return contactNumber;
  }
}

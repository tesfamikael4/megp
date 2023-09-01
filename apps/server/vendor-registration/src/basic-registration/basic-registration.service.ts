import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, } from 'typeorm';
import { CollectionQuery, FilterOperators, QueryConstructor } from '@collection-query';
import { DataResponseFormat } from '@api-data';
import { BasicRegistration } from './entities/basic-registration.entity';

import { SecurityQuestion } from './entities/security-question.entity';
import { CreateSecurityQuestionDto, UpdateSecurityQuestionDto, SecurityQuestionResponseDto } from './dto/security-question.dto';
import { BasicRegistrationResponseDto, CreateBasicRegistrationDto, UpdateBasicRegistrationDto } from './dto/basic-registration.dto';



@Injectable()
export class BasicRegistrationService {
  constructor(
    @InjectRepository(BasicRegistration)
    private readonly repository: Repository<BasicRegistration>,

    @InjectRepository(SecurityQuestion)
    private readonly securityQuestionRepository: Repository<SecurityQuestion>,
  ) { }

  async registerVendor(user: any, formFields: any) {
    try {
      const [email, password, phoneNumber, alternativeEmail, name, formOfBusiness, companyOrigin, district, country] = formFields;

      const basicRegistration = new BasicRegistration();

      basicRegistration.superTokenUserId = user.id;
      basicRegistration.email = email.value;
      basicRegistration.phoneNumber = phoneNumber.value;
      basicRegistration.alternativeEmail = alternativeEmail.value;
      basicRegistration.name = name.value;
      basicRegistration.formOfBusiness = formOfBusiness.value;
      basicRegistration.companyOrigin = companyOrigin.value;
      basicRegistration.district = district.value;
      basicRegistration.country = country.value;


      const securityQuestion = new SecurityQuestion();
      securityQuestion.question = "What is your favorite color?";
      securityQuestion.answer = "Blue";

      basicRegistration.securityQuestions.push(securityQuestion);

      await this.repository.save(basicRegistration);
    } catch (error) {
      console.log("🚀 ~ file: account-information.service.ts:49 ~ AccountInformationService ~ registerVendor ~ error:", error)
    }
  }


  async create(accountInformation: CreateBasicRegistrationDto): Promise<BasicRegistrationResponseDto> {
    try {
      const accountInformationEntity = CreateBasicRegistrationDto.fromDto(accountInformation);
      await this.repository.save(accountInformationEntity);
      return BasicRegistrationResponseDto.toDto(accountInformationEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: CollectionQuery) {

    try {

      const dataQuery = QueryConstructor.constructQuery<BasicRegistration>(
        this.repository,
        query
      );
      const response = new DataResponseFormat<BasicRegistrationResponseDto>();
      if (query.count) {
        response.total = await dataQuery.getCount();
      } else {
        const [result, total] = await dataQuery.getManyAndCount();
        response.total = total;
        response.items = BasicRegistrationResponseDto.toDtos(result);
      }
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string): Promise<BasicRegistrationResponseDto> {
    try {
      const accountInformationEntity = await this.repository.findOne({ where: { id } });
      return BasicRegistrationResponseDto.toDto(accountInformationEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, accountInformation: UpdateBasicRegistrationDto): Promise<BasicRegistrationResponseDto> {
    try {
      accountInformation.id = id;
      const accountInformationEntity = UpdateBasicRegistrationDto.fromDto(accountInformation);
      await this.repository.update({ id: accountInformation.id }, accountInformationEntity);
      return BasicRegistrationResponseDto.toDto(accountInformationEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.repository.delete({ id: id });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async addSecurityQuestion(securityQuestion: CreateSecurityQuestionDto): Promise<SecurityQuestionResponseDto> {
    try {
      const securityQuestionEntity = CreateSecurityQuestionDto.fromDto(securityQuestion);
      await this.securityQuestionRepository.save(securityQuestionEntity);
      return SecurityQuestionResponseDto.toDto(securityQuestionEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateSecurityQuestion(id: string, securityQuestion: UpdateSecurityQuestionDto): Promise<SecurityQuestionResponseDto> {
    try {
      securityQuestion.id = id;
      const securityQuestionEntity = UpdateSecurityQuestionDto.fromDto(securityQuestion);
      await this.securityQuestionRepository.update({ id: securityQuestion.id }, securityQuestionEntity);
      return SecurityQuestionResponseDto.toDto(securityQuestionEntity);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async removeSecurityQuestion(id: string): Promise<void> {
    try {
      await this.securityQuestionRepository.delete({ id: id });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

}
import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { BidRegistration } from 'src/entities/bid-registration.entity';
import { DocumentTypeEnum } from 'src/shared/enums';

@Injectable()
export class EncryptionHelperService {
  encryptData(data: string, password: string, salt: string): string {
    try {
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
      const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        key,
        Buffer.alloc(16, 0),
      );

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error) {
      throw error;
    }
  }

  decryptedData(data: string, password: string, salt: string) {
    try {
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');

      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        key,
        Buffer.alloc(16, 0),
      );

      let decrypted = decipher.update(data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      if (error?.code == 'ERR_OSSL_BAD_DECRYPT') {
        throw new BadRequestException('invalid_password');
      }

      throw error;
    }
  }

  checkPasswordValidity(
    bidRegistration: BidRegistration,
    documentType: string,
    password: string,
  ) {
    const data = bidRegistration.bidderId + bidRegistration.id;

    if (documentType == DocumentTypeEnum.RESPONSE) {
      const decrypted = this.decryptedData(
        bidRegistration.response,
        password,
        bidRegistration.salt,
      );

      return data == decrypted;
    } else if (documentType == DocumentTypeEnum.FINANCIAL_RESPONSE) {
      const decrypted = this.decryptedData(
        bidRegistration.financialResponse,
        password,
        bidRegistration.salt,
      );

      return data == decrypted;
    } else if (documentType == DocumentTypeEnum.TECHNICAL_RESPONSE) {
      const decrypted = this.decryptedData(
        bidRegistration.technicalResponse,
        password,
        bidRegistration.salt,
      );

      return data == decrypted;
    }

    throw new BadRequestException('invalid_document_type');
  }
}

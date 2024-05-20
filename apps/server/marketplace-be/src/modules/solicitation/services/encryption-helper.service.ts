import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SolRegistration } from 'src/entities';

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

  checkPasswordValidity(solRegistration: SolRegistration, password: string) {
    const data = solRegistration.vendorId + solRegistration.vendorName;

    const decrypted = this.decryptedData(
      solRegistration.response,
      password,
      solRegistration.salt,
    );

    return data == decrypted;
  }
}

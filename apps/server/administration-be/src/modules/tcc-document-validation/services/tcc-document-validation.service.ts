import { Injectable } from '@nestjs/common';
import { CommonHttpService } from '@common-http';

@Injectable()
export class TccDocumentValidationService {
  constructor(private commonHttpService: CommonHttpService) {}

  async getTaxpayerCertificateByValidationCode(
    validationCode: string,
  ): Promise<DocumentValidationResponse | null> {
    try {
      const urlPath = '/validate-with-vc';
      const body = {
        value: validationCode,
      };
      const response = await this.commonHttpService.sendPostRequest(
        urlPath,
        body,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

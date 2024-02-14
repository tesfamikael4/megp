import { Injectable } from '@nestjs/common';
import CertificatePDF from './pdf_generator';

@Injectable()
export class PdfGeneratorService {
  async pdfGenerator(data) {
    const result = await CertificatePDF({ data });
    return result;
  }
}

import { Injectable } from '@nestjs/common';
import { preReportPdf } from './report-pre-budget';
import { postReportPdf } from './report-post-budget';

@Injectable()
export class PdfGeneratorService {
  async pdfGenerator(data: object, type: string) {
    let result;
    const functionMap = {
      pre: preReportPdf,
      post: postReportPdf,
    };

    if (functionMap.hasOwnProperty(type)) {
      result = await functionMap[type]({ activities: data });
    }

    return result;
  }
}

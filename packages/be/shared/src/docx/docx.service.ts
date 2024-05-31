import { Injectable } from '@nestjs/common';
import { listCommands, createReport } from 'docx-templates';

@Injectable()
export class DocxService {
  async validateDocument(template: Buffer, requiredProperties: string[]) {
    try {
      const providedValues = await listCommands(template, ['{', '}']);
      const result = requiredProperties.filter(
        (r) => !providedValues.find((p) => p.code == r),
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async generateDocx(template: Buffer, data: any) {
    const buffer = await createReport({
      template,
      data,
    });
    return Buffer.from(buffer);
  }
}

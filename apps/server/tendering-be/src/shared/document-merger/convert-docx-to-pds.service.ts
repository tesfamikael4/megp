import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';

@Injectable()
export class ConvertDocxToPdsService {
  async convertDocxToPdf(file: Buffer): Promise<Buffer> {
    try {
      const FILE_CONVERT_ENDPOINT =
        process.env.FILE_CONVERT_ENDPOINT ?? 'http://localhost:3000/';
      const form = new FormData();

      form.append('file', file, 'inputFile.docx');

      const request = await axios.post(FILE_CONVERT_ENDPOINT, form, {
        responseType: 'arraybuffer',
      });

      const outputBuffer = request.data;
      return outputBuffer;
    } catch (error) {
      throw error;
    }
  }
}

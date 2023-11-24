import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class CommonHttpService {
  constructor() {
    // super();
  }
  async sendPostRequest(urlPath: string, body: any): Promise<any> {
    try {
      const url =
        process.env.BASE_URL_EXTERNAL_API +
        process.env.ADDITIONAL_ROUTE +
        urlPath;
      const headers = {
        UID: process.env.UID,
        APIKEY: process.env.APIKEY,
      };
      const response = await axios.post(url, body, { headers });
      if (response.status === 200) {
        return response.data;
      } else {
        // Handle non-200 status codes here
        const errorMessage = `api_failed: ${response.status} : ${response.statusText}`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Handle network errors, timeouts.
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorMessage = `api_failed: ${
          axiosError.response?.status || 'unknown'
        } : ${axiosError.message}`;
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  }
}

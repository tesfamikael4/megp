import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MpgsPaymentService {
  async initiatePayment() {
    try {
      const payload = {
        apiOperation: 'INITIATE_CHECKOUT',
        interaction: {
          merchant: {
            name: 'The Company Co',
            url: 'https://www.merchant-site.com',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Verlagsgruppe_Random_House_Logo_2016.png',
          },
          displayControl: {
            billingAddress: 'HIDE',
            // "customerEmail": "MANDATORY"
          },
          timeout: 1800,
          timeoutUrl: 'https://www.google.com',
          cancelUrl: 'http://www.google.com',
          operation: 'PURCHASE',
          // "style": {
          //     "accentColor": "#30cbe3"
          // }
        },
        order: {
          amount: '123.60',
          currency: 'MWK',
          description: 'This is the order description',
          id: 'ORDER-4142773a-ac2e',
        },
      };

      const auth = Buffer.from(
        process.env.MPGS_PAYMENT_USERNAME +
          ':' +
          process.env.MPGS_PAYMENT_PASSWORD,
      ).toString('base64');

      const result = await axios.post(process.env.MPGS_PAYMENT_API, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + auth,
        },
      });

      const data = await result.data;

      return data;
    } catch (error) {
      throw error;
    }
  }
}

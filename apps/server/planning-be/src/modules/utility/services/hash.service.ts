// import { Injectable } from '@nestjs/common';
// import * as qrcode from 'qrcode';

// @Injectable()
// export class QrCodeService {
//   async generateQrCode(data: any): Promise<string> {
//     try {
//       const filename =
//         data.personnelId + '_' + data.applicationName + '_' + '.png';
//       await qrcode.toFile(filename, JSON.stringify(data), {
//         color: {
//           dark: '#000', // black dots
//           light: '#fff', // Transparent background
//         },
//       });
//       return filename;
//     } catch (error) {
//       throw new Error('Failed to generate QR code.');
//     }
//   }
// }

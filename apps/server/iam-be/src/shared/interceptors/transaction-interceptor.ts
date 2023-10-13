// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { DataSource } from 'typeorm';

// @Injectable()
// export class TransactionMiddleware implements NestMiddleware {
//   constructor(private connection: DataSource) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const queryRunner = this.connection.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();
//     req['queryRunner'] = queryRunner;

//     try {
//       // Execute the request and continue the middleware chain
//       await next();

//       // Commit the transaction if no errors occurred
//       await queryRunner.commitTransaction();
//     } catch (error) {
//       // Rollback the transaction if an error occurred
//       await queryRunner.rollbackTransaction();
//       throw error;
//     } finally {
//       // Release the queryRunner after the response is sent
//       await queryRunner.release();
//     }
//   }
// }

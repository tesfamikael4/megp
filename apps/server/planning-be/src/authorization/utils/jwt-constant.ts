import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const JwtConstant = {
  JWT_SECRET: process.env.JWT_SECRET,
  ISSUER: process.env.ISSUER,
};

import { z } from 'zod';

export const authSlug = z.enum(['login', 'register', 'otp', 'reset-password']);
export type AuthSlug = z.infer<typeof authSlug>;

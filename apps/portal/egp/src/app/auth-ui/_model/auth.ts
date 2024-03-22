import { z } from 'zod';

export const authSlug = z.enum(['login', 'register']);
export type AuthSlug = z.infer<typeof authSlug>;

import { z } from 'zod';

export const isUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const urlSchema = z.string().refine(isUrl, { message: 'Invalid URL' });

export type Url = z.infer<typeof urlSchema>;

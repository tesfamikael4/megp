import { z } from 'zod';

export const schema = z.object({
  requesterInformation: z.object({
    companyName: z
      .string()
      .min(2, { message: 'Company Name should have at least 2 letters' }),
    legalFormOfEntity: z
      .string()
      .min(4, { message: 'Legal form Of entity is required' }),
    countryOfRegistration: z
      .string()
      .min(2, { message: 'Country of registration is required' }),
    termsAndConditions: z.boolean(),
  }),
});

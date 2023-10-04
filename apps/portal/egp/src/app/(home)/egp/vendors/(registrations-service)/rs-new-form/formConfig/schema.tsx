import { z } from 'zod';

export const schema = z.object({
  addressInformation: z.object({
    postalAddress: z
      .string()
      .min(2, { message: 'Name should have at least 2 letters' }),
    primaryEmail: z.string().email({ message: 'Invalid email' }),
  }),
  contactPersons: z.object({
    contactPersonsTable: z.array(
      z.object({
        firstName: z.string().min(2, { message: 'required' }),
        lastName: z.string().min(2, { message: 'required' }),
        email: z.string().email({ message: 'invalid email' }),
        mobileNumber: z.string().min(6, { message: 'required' }),
      }),
    ),
  }),
});

import { z } from 'zod';

export const schema = z.object({
  addressInformation: z.object({
    postalAddress: z
      .string()
      .min(2, { message: 'Name should have at least 2 letters' }),
    primaryEmail: z.string().email({ message: 'Invalid email' }),
    geoLocation: z.object({
      xCoordinate: z.string().min(6, { message: 'Required' }),
      yCoordinate: z.string().min(6, { message: 'Required' }),
    }),
  }),
  areasOfBusinessInterest: z.object({
    category: z.array(z.string()).min(1, { message: 'Category is required' }),
    lineOfBusiness: z.string().min(6, { message: 'required' }),
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

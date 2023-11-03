import { z } from 'zod';

export const contactPersonSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  mobileNumber: z
    .string()
    .min(10, {
      message: 'Phone number must be at least 10 characters long',
    })
    .max(15, { message: 'Phone number cannot exceed 15 characters' }),
});
export const bankAccountSchema = z.object({
  accountHolderFullName: z
    .string()
    .min(2, {
      message: "Account Holder's Full Name must be at least 2 characters long",
    })
    .max(100, {
      message: "Account Holder's Full Name cannot exceed 100 characters",
    }),
  accountNumber: z
    .string()
    .min(4, { message: 'Account Number must be at least 4 digits' })
    .max(9999999999, { message: 'Account Number cannot exceed 10 digits' }),
  bankBranchAddress: z.string(),
  currency: z.string().min(3, { message: 'Currency must be a 3-letter code' }),
  bankSWIFT_BICCode: z
    .string()
    .min(8, { message: 'SWIFT/BIC Code must be at least 8 characters long' })
    .max(11, { message: 'SWIFT/BIC Code cannot exceed 11 characters' }),
  iBAN: z
    .string()
    .min(8, { message: 'IBAN must be at least 8 characters long' })
    .max(34, { message: 'IBAN cannot exceed 34 characters' }),
  bankId: z.string(),
  hashValue: z.string(),
  branchName: z.string(),
});
export const shareHoldersSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  nationality: z.string().min(2, { message: 'Nationality is required' }),
  share: z
    .string()
    .min(1, { message: 'Share is required ' })
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: 'Number of Share must be greater than 1 ',
    }),
});
export const beneficialOwnershipSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  nationality: z.string().min(2, { message: 'Nationality is required' }),
});

export const formDataSchema = z.object({
  basic: z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' })
      .max(100, { message: 'Name cannot exceed 100 characters' }),
    businessType: z
      .string()
      .min(2, { message: 'Form of business is required' }),
    origin: z.string(),
    district: z.string(),
    country: z.string(),
    tinNumber: z.string(),
  }),
  address: z.object({
    postalAddress: z
      .string()
      .min(5, { message: 'Postal Address must be at least 5 characters long' })
      .max(150, { message: 'Postal Address cannot exceed 150 characters' }),
    primaryEmail: z
      .string()
      .email({ message: 'Primary Email must be a valid email address' }),
    alternateEmail: z
      .string()
      .email({ message: 'Alternate Email must be a valid email address' }),
    mobilePhone: z
      .string()
      .min(10, {
        message: 'Mobile Phone number must be at least 10 characters long',
      })
      .max(15, { message: 'Mobile Phone number cannot exceed 15 characters' }),
    telephone: z
      .string()
      .min(10, {
        message: 'Telephone number must be at least 10 characters long',
      })
      .max(15, { message: 'Telephone number cannot exceed 15 characters' }),
    fax: z
      .string()
      .min(6, { message: 'Fax number must be at least 10 characters long' })
      .max(8, { message: 'Fax number cannot exceed 15 characters' }),
    website: z.string().url({ message: 'Website must be a valid URL' }),
  }),
  businessSizeAndOwnership: z.object({
    registeredCapital: z.object({
      amount: z
        .string()
        .min(1, { message: 'Amount is required ' })
        .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
          message: 'Amount must be greater than 1 ',
        }),
      currency: z.string(),
    }),
    paidUpCapital: z.object({
      amount: z
        .string()
        .min(1, { message: 'Amount is required ' })
        .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
          message: 'Amount must be greater than 1 ',
        }),
      currency: z.string(),
    }),
    numberOfEmployees: z
      .string()
      .min(1, { message: 'Number of employees is required ' })
      .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
        message: 'Number of employees must be greater than 1 ',
      }),
    ownershipType: z.string(),
  }),
  contactPersons: z.array(contactPersonSchema).refine((arr) => arr.length > 0, {
    message: 'At least one contact person is required',
  }),
  bankAccountDetails: z
    .array(bankAccountSchema)
    .refine((arr) => arr.length > 0, {
      message: 'At least one Back account is required',
    }),
  shareHolders: z.array(shareHoldersSchema).refine((arr) => arr.length > 0, {
    message: 'At least one share holders is required',
  }),
  beneficialOwnership: z
    .array(beneficialOwnershipSchema)
    .refine((arr) => arr.length > 0, {
      message: 'At least one beneficial ownership is required',
    }),
});

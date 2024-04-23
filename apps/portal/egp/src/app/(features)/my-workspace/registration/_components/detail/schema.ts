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
export const bankAccountSchema = z.discriminatedUnion('bankType', [
  z.object({
    bankId: z.string(),
    hashValue: z.string(),
    bankType: z.literal('International'),
    bankName: z.string().min(3, { message: 'Bank name is required ' }),
    branchName: z.string().min(3, { message: 'Branch name is required ' }),
    accountType: z.enum(['Saving', 'Credit', 'Current']),
    accountNumber: z
      .string()
      .min(4, { message: 'Account Number must be at least 4 digits' })
      .max(9999999999, { message: 'Account Number cannot exceed 10 digits' }),
    branchAddress: z.string().optional(),
    accountHolderFullName: z
      .string()
      .min(2, {
        message:
          "Account Holder's Full Name must be at least 2 characters long",
      })
      .max(100, {
        message: "Account Holder's Full Name cannot exceed 100 characters",
      }),
    currency: z
      .string()
      .min(3, { message: 'Currency must be a 3-letter code' }),
    IBAN: z
      .string()
      .min(1, { message: 'IBAN must be at least 8 characters long' })
      .max(34, { message: 'IBAN cannot exceed 34 characters' }),
    swiftCode: z
      .string()
      .min(1, { message: 'SWIFT/BIC Code must be at least 8 characters long' })
      .max(11, { message: 'SWIFT/BIC Code cannot exceed 11 characters' }),
    isDefualt: z.coerce.boolean().default(false).optional(),
  }),
  z.object({
    bankId: z.string(),
    hashValue: z.string(),
    bankType: z.literal('Local'),
    bankName: z.string().min(3, { message: 'Bank name is required ' }),
    branchName: z.string().min(3, { message: 'Branch name is required ' }),
    accountType: z.enum(['Saving', 'Credit', 'Current']),
    accountNumber: z
      .string()
      .min(4, { message: 'Account Number must be at least 4 digits' })
      .max(9999999999, { message: 'Account Number cannot exceed 10 digits' }),
    branchAddress: z.string().optional(),
    accountHolderFullName: z
      .string()
      .min(2, {
        message:
          "Account Holder's Full Name must be at least 2 characters long",
      })
      .max(100, {
        message: "Account Holder's Full Name cannot exceed 100 characters",
      }),
    currency: z
      .string()
      .min(3, { message: 'Currency must be a 3-letter code' }),
    isDefualt: z.coerce.boolean().default(false).optional(),
  }),
]);
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
  share: z.coerce
    .number()
    .min(1, { message: 'Share is required ' })
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: 'Number of Share must be greater than 1% ',
    })
    .refine((value) => Number(value) <= 100, {
      message: 'Number of Share must be less than or equal to 100% ',
    }),
});
export const beneficialOwnershipShareholderSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  middleName: z
    .string()
    .min(2, { message: 'Middle Name must be at least 2 characters long' })
    .max(50, { message: 'Middle Name cannot exceed 50 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last Name must be at least 2 characters long' })
    .max(50, { message: 'Last Name cannot exceed 50 characters' }),
  nationality: z.string().min(2, { message: 'Nationality is required' }),
  countryOfResidence: z
    .string()
    .min(2, { message: 'Country of Residence is required' }),
  share: z.coerce
    .number()
    .min(1, { message: 'Share is required ' })
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: 'Number of Share must be greater than 1% ',
    })
    .refine((value) => Number(value) <= 100, {
      message: 'Number of Share must be less than or equal to 100% ',
    }),
  votingRights: z.coerce
    .number()
    .min(1, { message: 'Voting Rights is required ' })
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: 'Number of Voting Rights must be greater than 1% ',
    })
    .refine((value) => Number(value) <= 100, {
      message: 'Number of Voting Rights must be less than or equal to 100% ',
    }),
  authorityToAppointGov: z.coerce.boolean(),
});

export const formDataSchema = z
  .object({
    basic: z.object({
      name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(100, { message: 'Name cannot exceed 100 characters' }),
      businessType: z.string().optional(),
      countryOfRegistration: z.string(),
      district: z.string().optional(),
      tinNumber: z.string(),
    }),

    address: z.object({
      // countryOfRegistration: z.literal('Malawi'),
      physicalAddress: z
        .string()
        .min(1, { message: 'Physical Address is required' }),
      postalAddress: z
        .string()
        .min(1, { message: 'Physical Address must be a valid email address' }),
      primaryEmail: z
        .string()
        .email({ message: 'Primary Email must be a valid email address' }),

      region: z
        .string({
          invalid_type_error: 'Region is required ',
        })
        .optional(),
      district: z.string().optional(),
      alternateEmail: z
        .string()
        .email({ message: 'Alternate Email must be a valid email address' }),
      telephone: z
        .string()
        .min(10, {
          message: 'Telephone number must be at least 10 characters long',
        })
        .max(15, {
          message: 'Mobile Phone number cannot exceed 15 characters',
        }),
      fax: z.string().optional(),
      website: z.string().optional(),
    }),
    businessSizeAndOwnership: z
      .object({
        registeredCapital: z.object({
          amount: z.coerce.string().min(1, { message: 'Amount is required ' }),
          currency: z
            .string({
              required_error: 'Currency is required ',
              invalid_type_error: 'Currency is required ',
            })
            .min(1, { message: 'Currency is required ' }),
        }),
        paidUpCapital: z.object({
          amount: z.coerce.string().min(1, { message: 'Amount is required ' }),
          currency: z
            .string({
              required_error: 'Currency is required ',
              invalid_type_error: 'Currency is required ',
            })
            .min(1, { message: 'Currency is required ' }),
        }),
        numberOfEmployees: z
          .string()
          .min(1, { message: 'Number of employees is required ' })
          .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
            message: 'Number of employees must be greater than 1 ',
          }),
      })
      .refine(
        (obj) => {
          const paidUpAmount = Number(
            obj.paidUpCapital.amount.replace(/,/g, ''),
          );
          const registeredAmount = Number(
            obj.registeredCapital.amount.replace(/,/g, ''),
          );

          return registeredAmount >= paidUpAmount;
        },
        {
          path: ['paidUpCapital.amount'],
          message:
            'Paid up capital must be less than or equal to registered capital',
        },
      ),
    contactPersons: z
      .array(contactPersonSchema)
      .refine((arr) => arr.length > 0, {
        message: 'At least one contact person is required',
      })
      .refine((arr) => arr.length <= 3, {
        message: 'Maximum number of contact persons is 3',
      }),
    bankAccountDetails: z
      .array(bankAccountSchema)
      .refine((arr) => arr.length > 0, {
        message: 'At least one Back account is required',
      }),
    beneficialOwnershipShareholders: z
      .array(beneficialOwnershipShareholderSchema)
      .refine((arr) => arr.length > 0, {
        message: 'At least one beneficial ownership is required',
      })
      .refine(
        (arr) => arr.reduce((acc, cur) => acc + Number(cur.share), 0) <= 100,
        {
          message: 'Total share must be less than or equal to 100%',
        },
      )
      .refine(
        (arr) =>
          arr.reduce((acc, cur) => acc + Number(cur.votingRights), 0) <= 100,
        {
          message: 'Total voting rights must be less than or equal to 100%',
        },
      ),
  })
  .refine(
    (vendor) => {
      const isMalawi = vendor.basic.countryOfRegistration === 'Malawi';
      console.log({ isMalawi });

      if (isMalawi) {
        return Boolean(vendor.address.district);
      } else {
        return true;
      }
    },
    {
      message: 'Region is required',
      path: ['address.region'],
    },
  )
  .refine(
    (vendor) => {
      const isMalawi = vendor.basic.countryOfRegistration === 'Malawi';
      if (isMalawi) {
        return Boolean(vendor.address.district);
      } else {
        return true;
      }
    },
    {
      message: 'District is required',
      path: ['address.district'],
    },
  );

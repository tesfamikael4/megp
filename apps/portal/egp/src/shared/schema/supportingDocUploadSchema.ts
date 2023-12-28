import { TypeOf, z } from 'zod';

export const supportingDocUploadSchema = z.object({
  fieldName: z.string().min(1, { message: 'Field Name is required' }),
  file: z.instanceof(File).refine((data) => data instanceof File, {
    message: 'attachment is required is required',
  }),
});

export const paymentSlipResponseSchema = z.object({
  transactionId: z.string().min(1, { message: 'Transaction ID is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  invoiceId: z.string().min(1, { message: 'Invoice ID is required' }),
  attachment: z.string().min(1, { message: 'Attachment is required' }),
});

export type ISupportingDocUploadSchema = TypeOf<
  typeof supportingDocUploadSchema
>;

export type IPaymentSlipUploadResponseSchema = TypeOf<
  typeof paymentSlipResponseSchema
>;

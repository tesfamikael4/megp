import { TypeOf, z } from 'zod';

export const paymentSlipUploadSchema = z.object({
  invoiceId: z.string().min(1, { message: 'ID is required' }),
  serviceId: z.string().min(1, { message: 'Service ID is required' }),
  transactionNumber: z
    .string()
    .min(3, { message: 'Transaction number is required' }),
  file: z.instanceof(File).refine((data) => data instanceof File, {
    message: 'Payment slip is required is required',
  }),
});

export const paymentSlipResponseSchema = z.object({
  transactionId: z.string().min(1, { message: 'Transaction ID is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  invoiceId: z.string().min(1, { message: 'Invoice ID is required' }),
  attachment: z.string().min(1, { message: 'Attachment is required' }),
});

export type IPaymentSlipUploadSchema = TypeOf<typeof paymentSlipUploadSchema>;

export type IPaymentSlipUploadResponseSchema = TypeOf<
  typeof paymentSlipResponseSchema
>;

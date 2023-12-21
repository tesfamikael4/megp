import { z } from 'zod';

export const paymentReceiptItemSchema = z.object({
  transactionId: z.string().optional(),
  category: z.string().optional(),
  invoiceId: z.string().optional(),
  attachment: z.string().min(1, { message: 'Attachment is required' }),
});

export const paymentReceiptArraySchema = z
  .array(paymentReceiptItemSchema)
  .refine((data) => data.length > 0, {
    message: 'Payment Receipt array cannot be empty',
  });

export type PaymentReceiptItem = z.infer<typeof paymentReceiptItemSchema>;
export type PaymentReceiptArray = z.infer<typeof paymentReceiptArraySchema>;

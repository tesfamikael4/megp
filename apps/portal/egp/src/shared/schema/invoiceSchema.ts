import { z } from 'zod';

export const invoiceDataSchema = z.object({
  amount: z.string().min(1, { message: 'Amount is required' }),
  applicationNo: z.null(),
  attachment: z.null(),
  createdOn: z.string().min(1, { message: 'Created on is required' }),
  expired: z.boolean(),
  id: z.string().min(1, { message: 'ID is required' }),
  instanceId: z.null(),
  payToAccName: z
    .string()
    .min(1, { message: 'Pay to Account Name is required' }),
  payToAccNo: z
    .string()
    .min(1, { message: 'Pay to Account Number is required' }),
  payToBank: z.string().min(1, { message: 'Pay to Bank is required' }),
  payerName: z.string().min(1, { message: 'Payer Name is required' }),
  paymentStatus: z.string().min(1, { message: 'Payment Status is required' }),
  pricingId: z.string().min(1, { message: 'Pricing ID is required' }),
  remark: z.string().min(1, { message: 'Remark is required' }),
  serviceId: z.string().min(1, { message: 'Service ID is required' }),
  serviceName: z.string().min(1, { message: 'Service Name is required' }),
  taskId: z.null(),
  taskName: z.null(),
  userId: z.string().min(1, { message: 'User ID is required' }),
});

export const invoiceArraySchema = z
  .array(invoiceDataSchema)
  .refine((data) => data.length > 0, {
    message: 'Invoice array cannot be empty',
  });
export type InvoiceData = z.infer<typeof invoiceDataSchema>;
export type InvoiceArray = z.infer<typeof invoiceArraySchema>;

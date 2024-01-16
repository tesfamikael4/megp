import z from 'zod';

export const preferentialSchema = z.object({
  serviceId: z.string().uuid({ message: 'Invalid UUID' }),
  certificate: z.instanceof(File).refine((data) => data instanceof File, {
    message: 'Payment slip is required is required',
  }),
  certiNumber: z.string().min(3, { message: 'Transaction number is required' }),
  additionalDocuments: z.array(
    z.object({
      type: z
        .string({
          required_error: 'Name is required',
          invalid_type_error: 'Name must be a string',
        })
        .min(3, {
          message: 'Transaction number should have at least 3 characters',
        }),
      attachment: z.instanceof(File).refine((data) => data instanceof File, {
        message: 'Payment slip is required is required',
      }),
    }),
  ),
  remark: z.string().min(3, { message: 'Transaction number is required' }),
});

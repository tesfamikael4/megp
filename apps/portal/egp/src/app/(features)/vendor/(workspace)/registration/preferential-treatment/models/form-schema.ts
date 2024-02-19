import z from 'zod';

export const preferentialSchema = z.object({
  serviceId: z.string().uuid({ message: 'Preferential Treatment is Required' }),
  certificate: z
    .instanceof(File, { message: 'Attachment is required', fatal: true })
    .refine((data) => data instanceof File, {
      message: 'Attachment is required',
    }),
  certiNumber: z.string().min(3, { message: 'Transaction number is required' }),
  additionalDocuments: z
    .array(
      z.object({
        type: z
          .string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
          })
          .min(3, {
            message: 'Document Type/Name is required',
          }),
        attachment: z.instanceof(File).refine((data) => data instanceof File, {
          message: 'Attachment is required is required',
        }),
      }),
    )
    .optional(),
  remark: z.string().min(3, { message: 'Remark is required' }),
});

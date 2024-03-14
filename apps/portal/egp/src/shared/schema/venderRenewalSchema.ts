import { z } from 'zod';
export const approvedVendorServiceSchema = z.object({
  status: z.object({
    level: z.string().optional(),
    status: z.string().optional(),
    selectedPriceRange: z.any().optional(),
  }),
  data: z.array(
    z.object({
      id: z
        .string()
        .min(36)
        .refine(
          (value) =>
            /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(
              value,
            ),
          { message: 'id should be a string representing a valid UID' },
        ),
      vendorId: z
        .string()
        .min(36)
        .refine(
          (value) =>
            /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(
              value,
            ),
          { message: 'id should be a string representing a valid UID' },
        ),
      pricingId: z
        .string()
        .min(36)
        .refine(
          (value) =>
            /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(
              value,
            ),
          { message: 'id should be a string representing a valid UID' },
        ),
      areaOfBusinessInterest: z.object({
        id: z
          .string()
          .min(36)
          .refine(
            (value) =>
              /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(
                value,
              ),
            { message: 'id should be a string representing a valid UID' },
          ),
        category: z.string(),
        lineOfBusiness: z.array(
          z.object({
            id: z.string(),
            name: z.union([z.string(), z.array(z.string())]),
          }),
        ),
        priceRange: z
          .string()
          .min(36)
          .refine(
            (value) =>
              /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(
                value,
              ),
            {
              message: 'priceRange should be a string representing a valid UID',
            },
          ),
        vendorId: z
          .string()
          .min(36)
          .refine(
            (value) =>
              /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(
                value,
              ),
            { message: 'vendorId should be a string representing a valid UID' },
          ),
      }),
    }),
  ),
});

export type ApprovedVendorServiceSchema = z.infer<
  typeof approvedVendorServiceSchema
>;

export function validateApprovedVendorServiceSchema(data: any) {
  const validationResult = approvedVendorServiceSchema.safeParse(data);
  return {
    success: validationResult.success,
    data: validationResult.success
      ? (validationResult.data as ApprovedVendorServiceSchema)
      : undefined,
    errors: validationResult.success ? undefined : validationResult.error,
  };
}

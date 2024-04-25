import { z } from 'zod';

export const SpecificationTemplateSchema = z.object({
  itemMasterId: z.string(),
  quantity: z.number().positive(),
  properties: z.array(
    z.object({
      dataType: z.string(),
      validation: z.any().optional(),
      measurement: z.string().optional(),
      defaultValue: z.any().optional(),
      key: z.string(),
      displayName: z.string(),
      category: z.string(),
    }),
  ),
  deliveries: z.array(
    z.object({
      deliveryDate: z.date(),
      location: z.any(),
      deliverDays: z.number(),
    }),
  ),
  organizationId: z.string().optional(),
  organizationName: z.string().optional(),
});

export type SpecificationTemplateData = z.infer<
  typeof SpecificationTemplateSchema
>;

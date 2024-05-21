import { z } from 'zod';

export const SpecificationTemplateSchema = z.object({
  itemMasterId: z.string(),
  itemMasterCode: z.string(),
  quantity: z.number().positive().default(1),
  properties: z.array(
    z.object({
      dataType: z.string(),
      validation: z.any().optional(),
      measurement: z.string().optional(),
      defaultValue: z.any().optional(),
      key: z.string(),
      displayName: z.string(),
      category: z.string(),
      order: z.number().optional(),
    }),
  ),
  deliveries: z.array(
    z.object({
      deliveryDate: z.date().optional(),
      location: z.any().optional(),
      deliverDays: z.number().optional(),
    }),
  ),
  organizationId: z.string().optional(),
  organizationName: z.string().optional(),
});

export type SpecificationTemplateData = z.infer<
  typeof SpecificationTemplateSchema
>;

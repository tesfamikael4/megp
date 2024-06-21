import { ProductCatalogStatus } from 'src/shared/enums/product-catalog-enum';
import { z } from 'zod';

const CatalogSpecificationSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.any(),
  category: z.string().optional(),
  type: z.string().optional(),
});

export const ProductCatalogSchema = z.object({
  id: z.string().optional(),
  vendorId: z.string().optional(),
  vendorName: z.string().optional(),
  itemMasterId: z.string(),
  specificationTemplateId: z.string(),
  quantity: z.number().positive(),
  status: z
    .enum([
      ProductCatalogStatus.Active,
      ProductCatalogStatus.Draft,
      ProductCatalogStatus.Inactive,
    ])
    .optional(),
  specificationValues: z.array(CatalogSpecificationSchema),
  specifications: z.any().optional(),
  deliveryValues: z.array(
    z.object({
      deliveryDate: z.any(),
      location: z.any(),
      deliverDays: z.number(),
    }),
  ),
});

export type ProductCatalogData = z.infer<typeof ProductCatalogSchema>;

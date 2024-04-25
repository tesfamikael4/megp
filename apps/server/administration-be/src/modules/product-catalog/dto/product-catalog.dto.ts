import {
  ProductCatalogApprovalStatus,
  ProductCatalogStatus,
} from 'src/shared/enums/product-catalog-enum';
import { z } from 'zod';

const CatalogSpecificationSchema = z.object({
  key: z.string(),
  value: z.string(),
  category: z.string(),
});

const DeliveryValueSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const ProductCatalogSchema = z.object({
  id: z.string().optional(),
  vendor: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  itemMasterId: z.string(),
  specificationTemplateId: z.string(),
  quantity: z.number().positive(),
  status: z.enum([
    ProductCatalogStatus.Active,
    ProductCatalogStatus.Draft,
    ProductCatalogStatus.Inactive,
  ]),
  approvalStatus: z.enum([
    ProductCatalogApprovalStatus.Approved,
    ProductCatalogApprovalStatus.Submitted,
    ProductCatalogApprovalStatus.Rejected,
  ]),
  approver: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }),
  specificationValue: z.array(CatalogSpecificationSchema),
  deliveryValue: z.array(DeliveryValueSchema),
});

export type ProductCatalogData = z.infer<typeof ProductCatalogSchema>;

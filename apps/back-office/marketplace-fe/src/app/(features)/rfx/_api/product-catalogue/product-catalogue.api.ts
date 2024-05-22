import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const ProductCatalogueApi = entityApi.entitySliceApi['product-catalogs'];

export const productCatalogueSliceApi: typeof EntitySliceApi =
  createEntitySlice<any>(ProductCatalogueApi as any, 'product-catalogs');

export const {
  useListQuery,
  useLazyListQuery,
  useReadQuery,
  useLazyReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useLazyListArchivedQuery,
  useRestoreMutation,
} = productCatalogueSliceApi;

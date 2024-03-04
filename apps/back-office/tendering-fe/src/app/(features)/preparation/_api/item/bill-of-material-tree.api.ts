import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const sorBillOfMaterialTreeApi = createApi({
  reducerPath: 'sorBillOfMaterialTreeApi',
  tagTypes: ['scoring-tree'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    getBillOfMaterial: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        if (args.collectionQuery) {
          const query = encodeCollectionQuery(args.collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `sor-bill-of-materials/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['scoring-tree'],
    }),
  }),
});

export const { useGetBillOfMaterialQuery, useLazyGetBillOfMaterialQuery } =
  sorBillOfMaterialTreeApi;

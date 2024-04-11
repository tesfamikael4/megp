import { GetItemBidResponse } from '@/models/tender/bid-response/item-bid-response';
import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getItemsApi = createApi({
  reducerPath: 'getItemsApi',
  tagTypes: ['items'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    items: builder.query<any, any>({
      query: (args: { lotId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        if (args.collectionQuery) {
          const query = encodeCollectionQuery(args.collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `/items/list/${args.lotId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['items'],
    }),
    technicalRequirements: builder.mutation<any, any>({
      query: (data: GetItemBidResponse) => ({
        url: `bid-item-responses/get-item-response-sor`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['items'],
    }),
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
      providesTags: ['items'],
    }),
    getEquipment: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        return {
          url: `/sor-equipments/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['items'],
    }),
    getFee: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        return {
          url: `/sor-fees/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['items'],
    }),
    getLabor: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        return {
          url: `/sor-labors/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['items'],
    }),
    getMaterial: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        return {
          url: `/sor-bill-of-materials/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['items'],
    }),
    getReimbursableExpense: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        return {
          url: `/sor-reimbursable-expense/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['items'],
    }),
  }),
});

export const {
  useLazyItemsQuery,
  useTechnicalRequirementsMutation,
  useGetBillOfMaterialQuery,
  useLazyGetMaterialQuery,
  useLazyGetLaborQuery,
  useLazyGetFeeQuery,
  useLazyGetReimbursableExpenseQuery,
  useLazyGetEquipmentQuery,
} = getItemsApi;

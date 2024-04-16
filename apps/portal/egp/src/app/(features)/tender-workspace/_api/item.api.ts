import {
  BidResponse,
  GetBidResponse,
  GetItemBidResponse,
} from '@/models/tender/bid-response/item-bid-response';
import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getItemsApi = createApi({
  reducerPath: 'getItemsApi',
  tagTypes: ['bid-items'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    financialItems: builder.query<any, any>({
      query: (data: GetBidResponse) => ({
        url: `bid-item-responses/get-item-response-sor`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['bid-items'],
    }),

    items: builder.query<any, any>({
      query: (args: {
        data: GetBidResponse;
        type: 'financial' | 'technical';
      }) => {
        let q = '';
        return {
          url: `${args.type === 'technical' ? 'bid-item-responses/technical-response-items' : 'bid-item-responses/financial-response-items'}`,
          method: 'POST',
          body: args.data,
        };
      },
      providesTags: ['bid-items'],
    }),
    technicalRequirements: builder.query<any, any>({
      query: (data: GetItemBidResponse) => {
        let q = '';
        return {
          url: `bid-item-responses/get-item-response-sor`,
          method: 'POST',
          body: data,
        };
      },
      providesTags: ['bid-items'],
    }),
    getBillOfMaterial: builder.query<any, any>({
      query: (data: BidResponse) => {
        let q = '';
        return {
          url: `bid-item-responses/get-item-response-by-key`,
          method: 'POST',
          body: data,
        };
      },
      providesTags: ['bid-items'],
    }),
    getEquipment: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        return {
          url: `/sor-equipments/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-items'],
    }),
    getFee: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        return {
          url: `/sor-fees/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-items'],
    }),
    getLabor: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        return {
          url: `/sor-labors/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-items'],
    }),
    getMaterial: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        return {
          url: `/sor-bill-of-materials/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-items'],
    }),
    getReimbursableExpense: builder.query<any, any>({
      query: (args: { itemId: string; collectionQuery: CollectionQuery }) => {
        let q = '';
        return {
          url: `/sor-reimbursable-expense/list/${args.itemId}${q}`,
          method: 'GET',
        };
      },
      providesTags: ['bid-items'],
    }),
  }),
});

export const {
  useLazyFinancialItemsQuery,
  useLazyItemsQuery,
  useLazyTechnicalRequirementsQuery,
  useGetBillOfMaterialQuery,
  useLazyGetMaterialQuery,
  useLazyGetLaborQuery,
  useLazyGetFeeQuery,
  useLazyGetReimbursableExpenseQuery,
  useLazyGetEquipmentQuery,
} = getItemsApi;

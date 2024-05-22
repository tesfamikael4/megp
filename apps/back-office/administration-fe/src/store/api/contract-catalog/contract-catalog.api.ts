import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { create } from 'domain';

export const contractCatalogApi = createApi({
  reducerPath: 'contractCatalogApi',
  refetchOnFocus: true,
  tagTypes: [
    'ContractBeneficiary',
    'ContractItem',
    'ContractItemPrice',
    'specificationTemplate',
    'ContractAllocatedItem',
  ],
  baseQuery: baseQuery(
    process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/',
  ),
  endpoints: (builder) => ({
    assignContractBeneficiary: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `contract-beneficiaries/bulk-assign`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['ContractBeneficiary'],
    }),
    getContractBeneficiary: builder.query<any, string>({
      query: (id) => ({
        url: `contract-beneficiaries/list/${id}`,
      }),
      providesTags: ['ContractBeneficiary'],
    }),
    createContractItem: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `contract-items`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['ContractItem'],
    }),
    readContractItem: builder.query<any, string>({
      query: (id) => ({
        url: `contract-items/${id}`,
      }),
      providesTags: ['ContractItem'],
    }),
    updateContractItem: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `contract-items`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['ContractItem'],
    }),
    deleteContractBeneficiary: builder.mutation<any, string>({
      query: (id) => ({
        url: `contract-beneficiaries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContractBeneficiary'],
    }),

    listContractItem: builder.query<any, string>({
      query: (id) => ({
        url: `contract-items/list/${id}`,
      }),
      providesTags: ['ContractItem'],
    }),

    createContractItemPrice: builder.mutation<any, any>({
      query: (data) => ({
        url: `contract-item-prices`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContractItemPrice'],
    }),

    readContractItemPrice: builder.query<any, string>({
      query: (id) => ({
        url: `contract-item-prices/${id}`,
      }),
      providesTags: ['ContractItemPrice'],
    }),

    updateContractItemPrice: builder.mutation<any, any>({
      query: (data) => ({
        url: `contract-item-prices`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ContractItemPrice'],
    }),

    getTemplate: builder.query<any, string>({
      query: (id) => ({
        url: `specification-templates/item/${id}`,
      }),
      providesTags: ['specificationTemplate'],
    }),
    readItemMaster: builder.query<any, string>({
      query: (id) => {
        return { url: `item-masters/${id}`, method: 'GET' };
      },
    }),
    createAllocatedItem: builder.mutation<any, any>({
      query: (data) => ({
        url: `contract-allocated-items`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContractAllocatedItem'],
    }),
    readAllocatedItem: builder.query<any, string>({
      query: (id) => ({
        url: `contract-allocated-items/${id}`,
      }),
      providesTags: ['ContractAllocatedItem'],
    }),
    updateAllocatedItem: builder.mutation<any, any>({
      query: (data) => ({
        url: `contract-allocated-items`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ContractAllocatedItem'],
    }),
    deleteAllocatedItem: builder.mutation<any, string>({
      query: (id) => ({
        url: `contract-allocated-items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContractAllocatedItem'],
    }),
  }),
});

export const {
  useAssignContractBeneficiaryMutation,
  useGetContractBeneficiaryQuery,
  useLazyGetContractBeneficiaryQuery,
  useDeleteContractBeneficiaryMutation,

  useCreateContractItemMutation,
  useReadContractItemQuery,
  useUpdateContractItemMutation,
  useLazyListContractItemQuery,
  useListContractItemQuery,

  useCreateContractItemPriceMutation,
  useReadContractItemPriceQuery,
  useUpdateContractItemPriceMutation,

  useLazyGetTemplateQuery,
  useGetTemplateQuery,

  useReadItemMasterQuery,
  useLazyReadItemMasterQuery,

  useCreateAllocatedItemMutation,
  useUpdateAllocatedItemMutation,
  useReadAllocatedItemQuery,
  useLazyReadAllocatedItemQuery,
  useDeleteAllocatedItemMutation,
} = contractCatalogApi;

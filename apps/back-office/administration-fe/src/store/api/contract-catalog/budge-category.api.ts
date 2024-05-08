import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const contractCatalogApi = createApi({
  reducerPath: 'contractCatalogApi',
  refetchOnFocus: true,
  tagTypes: ['ContractBeneficiary'],
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
  }),
});

export const {
  useAssignContractBeneficiaryMutation,
  useGetContractBeneficiaryQuery,
  useLazyGetContractBeneficiaryQuery,
} = contractCatalogApi;

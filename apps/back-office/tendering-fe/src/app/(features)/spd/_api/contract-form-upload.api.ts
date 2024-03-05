import { ContractForm } from '@/models/spd/contract-forms.model';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const contractFormSpdApi = createApi({
  reducerPath: 'contractFormSpdApi',
  tagTypes: ['spd-contract-forms-upload'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    uploadContractForm: builder.mutation<any, any>({
      query: (data: ContractForm) => ({
        url: `spd-contract-forms/upload`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['spd-contract-forms-upload'],
    }),
    getFiles: builder.query<any, any>({
      query: (id: string) => ({
        url: `spd-contract-forms/download/${id}`,
      }),
      providesTags: ['spd-contract-forms-upload'],
    }),
  }),
});

export const {
  useUploadContractFormMutation,
  useGetFilesQuery,
  useLazyGetFilesQuery,
} = contractFormSpdApi;

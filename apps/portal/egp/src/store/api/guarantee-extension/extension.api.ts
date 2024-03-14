import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL =
  process.env.NEXT_PUBLIC_ADMINISTRATION_API ?? '/administration/api/';
export const extensionApi = createApi({
  reducerPath: 'extensionApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    extendGuarantee: builder.mutation<any, any>({
      query: (body) => {
        return {
          url: `guarantee-extensions`,
          method: 'POST',
          body: body,
        };
      },
    }),
    getGuaranteeExtension: builder.query<any, any>({
      query: (id) => `guarantee-extensions.list/${id}`,
    }),
  }),
});

export const { useExtendGuaranteeMutation } = extensionApi;

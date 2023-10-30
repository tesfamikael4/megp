import { adressApi } from '@/store/api/other/adress.api';

const organizationProfileApi = adressApi.injectEndpoints({
  endpoints: (builder) => ({
    read: builder.query<any, string>({
      query: (id: any) => ({
        url: `/organizations/${id}`,
        method: 'GET',
      }),
      providesTags: ['organizations'],
    }),

    setAddress: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/organizations/set-address/${data.id}`,
          method: 'PATCH',
          body: data,
        };
      },

      invalidatesTags: ['organizations'],
    }),
  }),
});

export const { useSetAddressMutation, useReadQuery } = organizationProfileApi;

import { adressApi } from '@/store/api/other/adress.api';

const organizationProfileApi = adressApi.injectEndpoints({
  endpoints: (builder) => ({
    read: builder.query<any, string>({
      query: (id: any) => ({
        url: `user/invitation`,
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    listById: builder.query<any, string>({
      query: (id: any) => ({
        url: `/user/list/${id}`,
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    inviteOa: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/user/create-organization-admin`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['user'],
    }),
  }),
});

export const {
  useInviteOaMutation,
  useReadQuery,
  useListByIdQuery,
  useLazyListByIdQuery,
} = organizationProfileApi;

import { adressApi } from '@/store/api/other/adress.api';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';

const organizationProfileApi = adressApi.injectEndpoints({
  endpoints: (builder) => ({
    read: builder.query<any, any>({
      query: () => ({
        url: `user/invitation`,
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    listById: builder.query<any, string>({
      query: (id) => ({
        url: `/user/organization-admin/${id}`,
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
    mandateToAssign: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery | undefined }
    >({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `mandates/organization/${id}${q}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useInviteOaMutation,
  useReadQuery,
  useListByIdQuery,
  useLazyListByIdQuery,
  useLazyMandateToAssignQuery,
  useMandateToAssignQuery,
} = organizationProfileApi;

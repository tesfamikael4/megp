import { encodeCollectionQuery } from '@megp/entity';
import { invitationApi } from '@/store/api/other/invitation.api';

const organizationProfileApi = invitationApi.injectEndpoints({
  endpoints: (builder) => ({
    list: builder.query<any, any>({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `organizations${q}`,
          method: 'GET',
        };
      },
      providesTags: ['organization'],
    }),
    read: builder.query<any, any>({
      query: (id) => {
        return {
          url: `/organizations/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['organization'],
    }),
    activateOrganization: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `/organizations/activate/${id}`,
          method: 'PATCH',
        };
      },
      invalidatesTags: ['organization'],
    }),

    create: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/organizations`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['organization'],
    }),

    update: builder.mutation<any, any>({
      query: ({ id, ...data }) => {
        return {
          url: `/organizations/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['organization'],
    }),

    delete: builder.mutation<any, string>({
      query: (id) => {
        return {
          url: `/organizations/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['organization'],
    }),
  }),
});

export const {
  useCreateMutation,
  useUpdateMutation,
  useLazyListQuery,
  useReadQuery,
  useListQuery,
  useActivateOrganizationMutation,
  useDeleteMutation,
} = organizationProfileApi;

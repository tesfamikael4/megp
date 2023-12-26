import { orgPermissionApi } from '@/store/api/other/org-permission.api';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';

const organizationMandateApi = orgPermissionApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissionByOrganizationId: builder.query<any, string>({
      query: (id) => ({
        url: `permissions/organization/${id}`,
        method: 'GET',
      }),
    }),
    ApplicationUnderOrganization: builder.query<
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
          url: `applications/organization/${id}${q}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useGetPermissionByOrganizationIdQuery,
  useLazyGetPermissionByOrganizationIdQuery,
  useApplicationUnderOrganizationQuery,
  useLazyApplicationUnderOrganizationQuery,
} = organizationMandateApi;

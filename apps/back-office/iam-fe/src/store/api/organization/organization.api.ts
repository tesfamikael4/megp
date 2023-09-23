import { CollectionQuery } from '@/shared/core/models';
import { collectionQueryBuilder } from '@/shared/core/utilities';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { User } from '@/models/user';
console.log(`${process.env.BASE_URL}`);
export const organizationApi = createApi({
  reducerPath: 'organizationApi',
  refetchOnFocus: true,
  tagTypes: ['organizations', 'organization'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_IAM_API}`,
  }),

  endpoints: (builder) => ({
    getOrganizations: builder.query<any, any>({
      query: (items: { items: CollectionQuery }) => ({
        url: 'organizations/get-all',
        method: 'GET',
        params: collectionQueryBuilder(items.items),
      }),

      providesTags: ['organizations'],
    }),

    getOrganizationById: builder.query<any, string>({
      query: (id) => ({
        url: `organizations/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['organization'],
    }),
    addOrganization: builder.mutation<any, any>({
      query: (organization) => {
        return {
          url: 'organizations/create',
          method: 'POST',
          body: organization,
        };
      },

      invalidatesTags: ['organizations'],
    }),
    updateOrganization: builder.mutation<any, any>({
      query: (updatedorganization) => {
        return {
          url: `organizations/update/${updatedorganization.id}`,
          method: 'PATCH',
          body: updatedorganization,
        };
      },
      invalidatesTags: ['organization', 'organizations'],
    }),
    deleteOrganization: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `organizations/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['organizations'],
    }),

    setOrganizationAdresse: builder.mutation<any, any>({
      query: (organizationAdress) => {
        return {
          url: `organizations/set-address/${organizationAdress.id}`,
          method: 'PATCH',
          body: organizationAdress,
        };
      },
    }),
    getInvitedOa: builder.query<any, any>({
      query: () => {
        return {
          url: `organizations/get-all`,
          method: 'GET',
        };
      },
    }),
    getInvitedOaById: builder.query<any, any>({
      query: (id) => {
        return {
          url: `personnel/${id}`,
          method: 'GET',
        };
      },
    }),
    updateInvitedOa: builder.mutation<any, any>({
      query: (personnel) => {
        return {
          url: `personnel/${personnel.id}`,
          method: 'PATCH',
          body: personnel,
        };
      },
    }),
    addInvitedOa: builder.mutation<any, any>({
      query: (personnel) => {
        return {
          url: `create-organization-administrator`,
          method: 'POST',
          body: personnel,
        };
      },
    }),
    getUserInvitationLink: builder.query<any, any>({
      query: () => {
        return {
          url: `user-invitation/get-invitation`,
          method: 'GET',
        };
      },
    }),

    // orgsnization mandate assignment
    sendUserInvitationLink: builder.query<any, any>({
      query: (id) => {
        return {
          url: `send-invitation/${id}`,
          method: 'PUT',
          body: id,
        };
      },
    }),
    addOrganizationMandate: builder.mutation<
      any,
      { dataSent: any; id: string }
    >({
      query: ({ dataSent, id }) => {
        return {
          url: `/organizations/assign-mandates/${id}`,
          method: 'POST',
          body: dataSent,
        };
      },
    }),

    getOrganiationMandate: builder.query<any, any>({
      query: (items: { items: CollectionQuery; id: string }) => {
        return {
          url: `organizations/get/${items?.id}?includes[0]=organizationMandates.mandate`,
          method: 'GET',
          params: collectionQueryBuilder(items.items),
        };
      },
    }),
    getAllMandates: builder.query<any, any>({
      query: (items: { items: CollectionQuery }) => {
        return {
          url: `mandates/get-all`,
          method: 'GET',
          params: collectionQueryBuilder(items.items),
        };
      },
    }),
    getOrganizationsAdmim: builder.query<any, any>({
      query: () => {
        return {
          url: `org-admin/get-all`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useLazyGetOrganizationsAdmimQuery,

  useAddOrganizationMandateMutation,
  useLazyGetOrganiationMandateQuery,
  useLazyGetAllMandatesQuery,

  useSendUserInvitationLinkQuery,
  useLazyGetUserInvitationLinkQuery,
  useAddInvitedOaMutation,
  useLazyGetInvitedOaByIdQuery,
  useGetInvitedOaByIdQuery,
  useUpdateInvitedOaMutation,
  useLazyGetInvitedOaQuery,
  useLazyGetOrganizationsQuery,
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useLazyGetOrganizationByIdQuery,
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useSetOrganizationAdresseMutation,
} = organizationApi;

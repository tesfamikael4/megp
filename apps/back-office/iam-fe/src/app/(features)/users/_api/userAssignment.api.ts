import { Mandate } from '@/models/mandate';
import { userRelationApi } from '@/store/api/other/user-relation';

const userRApi = userRelationApi.injectEndpoints({
  endpoints: (build) => ({
    getUnitByUserId: build.query<any, any>({
      query: (id) => {
        return {
          url: `/users/${id}?includes[0]=userUnits.unit`,
          method: 'GET',
        };
      },
      providesTags: ['userUnit'],
    }),

    AssignUnitToUser: build.mutation<any, { data: any; id: any }>({
      query: ({ data, id }) => {
        return {
          url: `/users/assign-units/${id}`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['userUnit'],
    }),

    // role assignment

    getRoleByUserId: build.query<any, any>({
      query: (id) => {
        return {
          url: `/users/${id}?includes[0]=userRoles.role`,
          method: 'GET',
        };
      },
      providesTags: ['userRoles'],
    }),

    AssignRoleToUser: build.mutation<any, { data: any; id: any }>({
      query: ({ data, id }) => {
        return {
          url: `/users/assign-roles/${id}`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['userRoles'],
    }),
    AssignGroupToUser: build.mutation<any, any>({
      query: (data) => {
        return {
          url: `/relation-user-groups`,
          method: 'POST',
          body: data,
        };
      },
      // invalidatesTags: ['userRoles'],
    }),
  }),
});

export const {
  useAssignGroupToUserMutation,
  useAssignRoleToUserMutation,
  useAssignUnitToUserMutation,
  useGetRoleByUserIdQuery,
  useGetUnitByUserIdQuery,
} = userRApi;

import { Mandate } from '@/models/mandate';
import { mandateApi } from '@/store/api/other/mandate.api';

const organizationMandateApi = mandateApi.injectEndpoints({
  endpoints: (build) => ({
    getUserByUnitId: build.query<any, any>({
      query: (id) => {
        return {
          url: `units/${id}?includes[0]=userUnits.user`,
          method: 'GET',
        };
      },
      // providesTags: ['unitUser'],
    }),

    AssignUserToUnit: build.mutation<any, { data: any; id: any }>({
      query: ({ data, id }) => {
        return {
          url: `units/assign-users/${id}`,
          method: 'POST',
          body: data,
        };
      },
      // invalidatesTags: ['unitUser'],
    }),
  }),
});

export const { useAssignUserToUnitMutation, useGetUserByUnitIdQuery } =
  organizationMandateApi;

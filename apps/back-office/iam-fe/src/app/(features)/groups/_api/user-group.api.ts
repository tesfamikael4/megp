import { Group } from '@/models/group';
import { userRelationApi } from '@/store/api/other/user-relation';

const userRApi = userRelationApi.injectEndpoints({
  endpoints: (build) => ({
    getUserByGroupId: build.query<any, any>({
      query: (id) => {
        return {
          url: `/relation-user-groups/${id}/user`,
          method: 'GET',
        };
      },
      providesTags: ['userGroup'],
    }),

    AssignUserToGroup: build.mutation<any, any>({
      query: (data) => {
        return {
          url: `relation-user-groups`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['userGroup'],
    }),
  }),
});

export const { useAssignUserToGroupMutation, useGetUserByGroupIdQuery } =
  userRApi;

// import { userRelationApi } from '@/store/api/other/user-relation';

// const userRApi = userRelationApi.injectEndpoints({
//   endpoints: (build) => ({
//     getUserByGroupId: build.query<any, string>({
//       query: (id) => {
//         return {
//           url: `/relation-user-groups/${id}/user`,
//           method: 'GET',
//         };
//       },
//       providesTags: ['userGroup'],
//     }),
//     getGroupByUserId: build.query<any, string>({
//       query: (id) => {
//         return {
//           url: `/relation-user-groups/${id}/group`,
//           method: 'GET',
//         };
//       },
//       providesTags: ['userGroup'],
//     }),
//     AssignUserToGroup: build.mutation<any, any>({
//       query: (data) => {
//         return {
//           url: `relation-user-groups`,
//           method: 'POST',
//           body: data,
//         };
//       },
//       invalidatesTags: ['userGroup'],
//     }),
//   }),
// });

// // export const { useAssignUserToGroupMutation, useGetUserByGroupIdQuery } =
// //   userRApi;

import { Group } from '@/models/group';
import entityApi from '@/store/entity/api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

// get base group api
const groupApi = entityApi.entitySliceApi['user-groups'];

export const groupSliceApi: typeof EntitySliceApi = createEntitySlice<Group>(
  groupApi as any,
  'user-groups',
);

export const {
  useRelationMutation,
  useLazyFirstRelationQuery,
  useLazySecondRelationQuery,
} = groupSliceApi;

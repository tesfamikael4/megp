import { Group } from '@/models/group';
import entityApi from '@/store/entity/api';

const groupApi = entityApi.entitySliceApi['group']


// export const groupSliceApi = groupApi.injectEndpoints({
//     endpoints: (builder) => ({
//         listGroup: builder.query<Group[], void>({
//             query: () => ({
//                 url: `/group`,
//                 method: 'GET',
//             }),
//             providesTags: (result) =>
//                 result
//                     ? [
//                         ...result.map(({ id }) => ({ type: 'Group' as const, id })),
//                         { type: 'Group', id: 'LIST' },
//                     ]
//                     : [{ type: 'Group', id: 'LIST' }],
//         }),
//         getGroup: builder.query<Group, string>({
//             query: (id) => ({
//                 url: `/group/${id}`,
//                 method: 'GET',
//             }),
//             providesTags: (result, error, id) => [{ type: 'Group', id }],
//         }),
//         addGroup: builder.mutation<Group, Partial<Group>>({
//             query(body) {
//                 return {
//                     url: `group`,
//                     method: 'POST',
//                     body,
//                 };
//             },
//             invalidatesTags: [{ type: 'Group', id: 'LIST' }],
//         }),
//         updateGroup: builder.mutation<Group, Partial<Group>>({
//             query(data) {
//                 const { id, ...body } = data;
//                 return {
//                     url: `group/${id}`,
//                     method: 'PUT',
//                     body,
//                 };
//             },

//             invalidatesTags: (result, error, { id }) => [{ type: 'Group', id }],
//         }),
//         deleteGroup: builder.mutation<{ success: boolean; id: string }, string>({
//             query(id) {
//                 return {
//                     url: `group/${id}`,
//                     method: 'DELETE',
//                 };
//             },

//             invalidatesTags: (result, error, id) => [{ type: 'Group', id }],
//         }),
//     }),
//     overrideExisting: false,
// });

// export const {
//     useListGroupQuery,
//     useGetGroupQuery,
//     useAddGroupMutation,
//     useUpdateGroupMutation,
//     useDeleteGroupMutation,
// } = groupSliceApi;

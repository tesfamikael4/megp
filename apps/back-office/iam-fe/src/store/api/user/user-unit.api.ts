import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserUnit } from '@/models/user/user-unit';
import { Role } from '@/models/user/role';

export const userUnitApi = createApi({
  reducerPath: 'userUnitApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3030/userunit',
  }),
  tagTypes: ['UserUnit', 'UserUnits'],
  endpoints: (builder) => ({
    getUserUnit: builder.query<UserUnit[], null>({
      query: () => '',
      providesTags: ['UserUnits'],
    }),
    getUserUnits: builder.query<UserUnit[], string>({
      query: (userId) => `?userId=${userId}`,
      providesTags: ['UserUnits'],
    }),
    getUserUnitById: builder.query<UserUnit, { id: string }>({
      query: (id) => `${id}`,
      providesTags: ['UserUnit'],
    }),

    addNewUserUnit: builder.mutation<any, any>({
      query: (newuserunit) => {
        return {
          url: ``,
          method: 'POST',
          body: newuserunit,
        };
      },
      invalidatesTags: ['UserUnit', 'UserUnit'],
    }),

    deleteUserUnit: builder.mutation<string, any>({
      query: (id: string) => {
        return {
          url: `${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['UserUnit', 'UserUnit'],
    }),
  }),
});

export const {
  useGetUserUnitQuery,
  useLazyGetUserUnitQuery,
  useGetUserUnitByIdQuery,
  useAddNewUserUnitMutation,
  useLazyGetUserUnitsQuery,
  useDeleteUserUnitMutation,
} = userUnitApi;

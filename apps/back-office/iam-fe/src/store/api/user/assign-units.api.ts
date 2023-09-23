import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userUnitBaseUrl } from './base-urls';

export const assignUnitApi = createApi({
  reducerPath: 'assignUnitApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: userUnitBaseUrl,
  }),
  tagTypes: ['UserUnit', 'UserUnits'],
  endpoints: (builder) => ({
    assignUnits: builder.mutation<any, any>({
      query: (data) => {
        console.log(data.userId, JSON.stringify(data.roles));

        return {
          url: `${data.userId}`,
          method: 'POST',
          body: data.units,
        };
      },
    }),
  }),
});

export const { useAssignUnitsMutation } = assignUnitApi;

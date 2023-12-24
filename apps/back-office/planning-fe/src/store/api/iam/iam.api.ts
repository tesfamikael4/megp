import { encodeCollectionQuery } from '@megp/entity';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const iamApi = createApi({
  reducerPath: 'iamApi',
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_IAM_API ?? '/iam/api/',
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<any, any>({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `user/list/${id}${q}`, method: 'GET' };
      },
    }),
  }),
});

export const { useLazyGetUsersQuery } = iamApi;

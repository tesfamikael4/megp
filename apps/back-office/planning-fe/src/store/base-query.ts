import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery = (baseUrl = '/') => {
  return fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  });
};

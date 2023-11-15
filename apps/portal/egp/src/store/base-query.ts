import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import { getCookie } from 'cookies-next';

export const baseQuery = (baseUrl = '/') => {
  return fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = getCookie('token');
      console.log(token);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  });
};

import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import { getCookie } from 'cookies-next';
const URL = process.env.NEXT_PUBLIC_VENDOR_API;

export const baseQuery = fetchBaseQuery({
  baseUrl: URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getCookie('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

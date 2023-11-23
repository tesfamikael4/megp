import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import jwtDecode from 'jwt-decode';

export const baseQuery = (baseUrl = '/') => {
  return fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: async (headers) => {
      const baseURL = process.env.NEXT_PUBLIC_IAM_API ?? '/';
      const token = getCookie('token');
      const refreshToken = getCookie('refreshToken');
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      if (token) {
        const decoded: Record<string, any> = jwtDecode(token);
        // Check if the token is expired
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTimestamp) {
          // Token has expired, refresh it
          const refreshedToken: Record<string, string> | undefined =
            await fetch(`${baseURL}/auth/refresh-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshToken}`,
              },
              body: JSON.stringify({
                refresh_token: refreshToken,
              }),
            }).then(async (res) => {
              if (res.ok) {
                const data = await res.json();
                return data;
              }
              deleteCookie('token');
              deleteCookie('refreshToken');
            });

          if (refreshedToken) {
            // Update the headers with the new token
            headers.set(
              'authorization',
              `Bearer ${refreshedToken.access_token}`,
            );
            setCookie('token', refreshedToken.access_token);
          } else {
            // Clear the cookie and log out the user
            deleteCookie('token');
          }
        } else {
          headers.set('authorization', `Bearer ${token}`);
        }
      }

      return headers;
    },
  });
};

import { Notifications } from '@/models/notification';
import { vendorRegistrationApi } from '@/store/api/vendor_registration/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

export const notificationsApi = vendorRegistrationApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      { total: number; items: Notifications[] },
      any
    >({
      query: () => `notifications/get-my-notifications`,
    }),
    getNotificationsByUserId: builder.query<any, { id: string }>({
      query: ({ id }) => `notifications/get-my-notifications`,
    }),
  }),
});

export const { useGetNotificationsByUserIdQuery, useGetNotificationsQuery } =
  notificationsApi;

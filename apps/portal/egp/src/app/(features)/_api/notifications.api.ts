import { Notifications } from '@/models/notification';
import { vendorRegistrationApi } from '@/store/api/vendor_registration/api';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
const baseUrl = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

export const notificationsApi = vendorRegistrationApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      { total: number; items: Notifications[] },
      CollectionQuery
    >({
      query: (collectionQuery) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return {
          url: `notifications/get-my-notifications${q}`,
        };
      },
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApi;

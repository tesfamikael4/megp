import { CollectionQuery } from '@/shared/core/models';
import { collectionQueryBuilder } from '@/shared/core/utilities';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pricingApi = createApi({
  reducerPath: 'priceApi',
  refetchOnFocus: true,
  tagTypes: ['prices', 'price'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://[::1]:3000/api/',
  }),
  endpoints: (builder) => ({
    getServices: builder.query<any, any>({
      query: () => ({
        url: 'VendorRegistrations/get-services',
        method: 'GET',
      }),
    }),
    getPrices: builder.query<any, any>({
      query: (data: { collectionQuery: CollectionQuery }) => ({
        url: 'ServicePricing/get-service-prices',
        method: 'GET',
        params: collectionQueryBuilder(data.collectionQuery),
      }),

      providesTags: ['prices'],
    }),
    getPriceById: builder.query<any, any>({
      query: (id) => ({
        url: `ServicePricing/get-service-price/${id}`,
        method: 'GET',
      }),
      providesTags: ['price'],
    }),

    addPrices: builder.mutation<any, any>({
      query: (price) => {
        return {
          url: 'ServicePricing/create-service-price',
          method: 'POST',
          body: price,
        };
      },

      invalidatesTags: ['prices'],
    }),
    updatePrice: builder.mutation<any, any>({
      query: (data: { price: any; id: string }) => {
        return {
          url: `ServicePricing/update-service-price/${data.id}`,
          method: 'PATCH',
          body: data.price,
        };
      },

      invalidatesTags: ['prices', 'price'],
    }),
    deletePrices: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `ServicePricing/delete-service-price/${id}`,
          method: 'DELETE',
        };
      },

      invalidatesTags: ['prices'],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetPricesQuery,
  useLazyGetPricesQuery,
  useAddPricesMutation,
  useDeletePricesMutation,
  useLazyGetPriceByIdQuery,
  useUpdatePriceMutation,
} = pricingApi;

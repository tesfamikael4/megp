import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const getVenderList = createApi({
  reducerPath: 'getVenderList',
  tagTypes: ['vendor-list'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'),
  endpoints: (builder) => ({
    venderByRegistrationId: builder.query<any, any>({
      query: (registrationNo: string) => {
        return {
          url: `vendors/get-vendor-by-registration-number/${registrationNo}`,
          method: 'GET',
        };
      },
      providesTags: ['vendor-list'],
    }),
  }),
});
export const getBds = createApi({
  reducerPath: 'getBds',
  tagTypes: ['bds', 'tender-personal'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    getBdsPreparation: builder.query<any, any>({
      query: (tenderId: string) => {
        return {
          url: `bds-preparations/${tenderId}`,
          method: 'GET',
        };
      },
      providesTags: ['bds'],
    }),
    getPersonnel: builder.query<any, any>({
      query: (tenderId: string) => {
        return {
          url: `tender-personals/list/${tenderId}`,
          method: 'GET',
        };
      },
      providesTags: ['tender-personal'],
    }),
  }),
});

export const { useLazyVenderByRegistrationIdQuery } = getVenderList;
export const { useLazyGetBdsPreparationQuery, useLazyGetPersonnelQuery } =
  getBds;

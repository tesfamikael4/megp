import { baseQuery } from '@/store/base-query';
import { encodeCollectionQuery } from '@megp/entity';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const URL = 'https://dev-bo.megp.peragosystems.com/administration/api';

export const administrationApi = createApi({
  reducerPath: 'administrationApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    getLineOfBusinesses: builder.query<any, any>({
      query: () => {
        const q = encodeCollectionQuery({
          orderBy: [
            {
              column: 'code',
              direction: 'ASC',
            },
          ],
          where: [
            [
              {
                column: 'parentCode',
                value: 'IsNull',
                operator: 'IsNull',
              },
            ],
          ],
        });
        return {
          url: `/classifications?q=${q}`,
          method: 'GET',
        };
      },
    }),
    getRegions: builder.query<any, any>({
      query: () => ({
        url: `/regions`,
        method: 'GET',
      }),
    }),
    getDistrictsByRegion: builder.query<any, { regionId: string }>({
      query: (data) => ({
        url: `/districts/list/${data.regionId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetLineOfBusinessesQuery,
  useGetRegionsQuery,
  useGetDistrictsByRegionQuery,
  useLazyGetDistrictsByRegionQuery,
} = administrationApi;

import { adressApi } from '@/store/api/other/adress.api';

const organizationProfileApi = adressApi.injectEndpoints({
  endpoints: (build) => ({
    setAddress: build.mutation<any, any>({
      query: (data) => {
        return {
          url: `/organizations/set-address/${data.id}`,
          method: 'PATCH',
          data: data,
        };
      },
    }),
  }),
});

export const { useSetAddressMutation } = organizationProfileApi;

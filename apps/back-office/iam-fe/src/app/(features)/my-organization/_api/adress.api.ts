import { adressApi } from '@/store/api/other/adress.api';
import { createEntitySlice, EntitySliceApi } from '@megp/entity';

const organizationProfileApi = adressApi.injectEndpoints({
  endpoints: (build) => ({
    setAddress: build.mutation<any, any>({
      query: (data) => {
        return {
          url: `organization/set-address/${data.id}`,
          method: 'PATCH',
          data: data,
        };
      },
    }),
  }),
});

export const { useSetAddressMutation } = organizationProfileApi;

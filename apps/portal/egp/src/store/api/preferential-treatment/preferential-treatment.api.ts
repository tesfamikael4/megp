import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

export const preferentialTreatmentApi = createApi({
  reducerPath: 'preferentialTreatmentApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    submitRequest: builder.mutation<any, any>({
      query: (body) => {
        const formData: any = new FormData();
        formData.append('certificate', body.certificate);
        formData.append('remark', body.remark);
        formData.append('serviceId', body.serviceId);
        formData.append('certiNumber', body.certiNumber);
        formData.append('status', body.status);
        body.additionalDocuments &&
          formData.append(
            'additionalDocuments',
            body.additionalDocuments.map((file: any) => file.attachment),
          );

        return {
          url: `preferentail-treatment/submit-pt-request`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    getMarginalizedGroup: builder.query<any, any>({
      query: () => `bp-services/get-marginilized-groups`,
      transformResponse: (response: any) => {
        return response.map((singleData: any) => ({
          value: singleData.id,
          label: singleData.name,
        }));
      },
    }),

    getDraftApplication: builder.query<any, any>({
      query: (body) => ({
        url: `preferentail-treatment/get-draft-pt-applications`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSubmitRequestMutation,
  useGetMarginalizedGroupQuery,
  useGetDraftApplicationQuery,
} = preferentialTreatmentApi;

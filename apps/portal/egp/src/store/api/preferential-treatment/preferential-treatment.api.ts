import { PreferentialTreatment } from '@/models/vendorRegistration';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
const URL = process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api';

export const preferentialTreatmentApi = createApi({
  reducerPath: 'preferentialTreatmentApi',
  refetchOnFocus: true,
  baseQuery: baseQuery(URL),
  endpoints: (builder) => ({
    submitRequest: builder.mutation<
      any,
      { certiNumber: string; serviceId: string; status: string }[]
    >({
      query: (body) => {
        return {
          url: `preferentail-treatment/submit-pt-request`,
          method: 'POST',
          body: body,
        };
      },
    }),
    uploadPreferentialAttachments: builder.mutation<any, any>({
      query: (body) => {
        const formData: any = new FormData();
        const createPTDto: { serviceId: string; certiNumber: string }[] = [];

        body.map((preferential) => {
          formData.append(
            `${preferential.category}Certi`,
            preferential.attachment,
          );
          const { attachment, category, type, ...rest } = preferential;
          createPTDto.push(rest);
        });

        return {
          url: `preferentail-treatment/upload-preferential-attachments`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    getPreferential: builder.query<any, any>({
      query: () => `bp-services/get-preferencials`,
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
  useGetPreferentialQuery,
  useSubmitRequestMutation,
  useGetMarginalizedGroupQuery,
  useGetDraftApplicationQuery,
  useUploadPreferentialAttachmentsMutation,
} = preferentialTreatmentApi;

import { vendorRegistrationApi } from '@/store/api/vendor_registration/api';

export const briefcaseApi = vendorRegistrationApi.injectEndpoints({
  endpoints: (build) => ({
    uploadToBriefcase: build.mutation<any, { file: File }>({
      query: (body) => {
        const formData = new FormData();
        formData.append('attachmentUrl', body.file);

        return {
          url: 'briefcases/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),
    getBriefcaseFiles: build.query<any[], any>({
      query: () => ({
        url: 'briefcases/get-briefcases',
        method: 'GET',
      }),
    }),
  }),
});

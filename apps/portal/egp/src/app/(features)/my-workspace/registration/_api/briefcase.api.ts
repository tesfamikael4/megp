import { vendorRegistrationApi } from '@/store/api/vendor_registration/api';

export const briefcaseApi = vendorRegistrationApi.injectEndpoints({
  endpoints: (build) => ({
    uploadToBriefcase: build.mutation<any, { file: File; description: string }>(
      {
        query: (body) => {
          const formData = new FormData();
          formData.append('attachmentUrl', body.file);
          formData.append(`name`, body.file.name);
          formData.append(`description`, body.description);

          return {
            url: 'briefcases/upload',
            method: 'POST',
            body: formData,
          };
        },
      },
    ),
    getBriefcaseFiles: build.query<any[], any>({
      query: () => ({
        url: 'briefcases/get-briefcases',
        method: 'GET',
      }),
    }),
    deleteBriefcaseFile: build.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `briefcases/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

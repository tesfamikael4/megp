import { baseQuery } from '@/store/base-query';
import { CollectionQuery, encodeCollectionQuery } from '@megp/entity';
import { createApi } from '@reduxjs/toolkit/query/react';

export const evaluationApprovalApi = createApi({
  reducerPath: 'evaluationApprovalApi',
  refetchOnFocus: true,
  tagTypes: ['evaluationApproval'],
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_RFX_API ?? '/marketplace/api/'),
  endpoints: (builder) => ({
    getCriterionWithBidders: builder.query<any, { id: string }>({
      query: (data) => ({
        url: `rfx-documentary-evidences/evidences-with-vendors/${data.id}`,
        method: 'GET',
      }),
    }),
    getPresignedForQualUpload: builder.query<any, { id: string }>({
      query: (data) => ({
        url: `get-presigned-for-qual-upload/${data.id}`,
        method: 'GET',
      }),
    }),
    getItemsForEvaluation: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery }
    >({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `rfx-items/items-for-evaluation/${id}${q}` };
      },
    }),
    getBiddersWithQualPrice: builder.query<
      any,
      { id: string; collectionQuery: CollectionQuery }
    >({
      query: ({ id, collectionQuery }) => {
        let q = '';
        if (collectionQuery) {
          const query = encodeCollectionQuery(collectionQuery);
          q = `?q=${query}`;
        }
        return { url: `get-items-for-evaluation/${id}${q}` };
      },
    }),
  }),
});

export const {
  useLazyGetCriterionWithBiddersQuery,
  useLazyGetPresignedForQualUploadQuery,
  useLazyGetItemsForEvaluationQuery,
  useLazyGetBiddersWithQualPriceQuery,
} = evaluationApprovalApi;

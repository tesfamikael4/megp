import { BillOfMaterial } from '@/models/tender/lot/item/bill-of-material.model';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const sorBillOfMaterialBulkCreateApi = createApi({
  reducerPath: 'sorBillOfMaterialBulkCreateApi',
  tagTypes: ['boq-bulk-create'],
  refetchOnFocus: true,
  baseQuery: baseQuery(process.env.NEXT_PUBLIC_TENDER_API ?? '/tendering/api/'),
  endpoints: (builder) => ({
    saveBoq: builder.mutation<any, any>({
      query: (args: { boqs: BillOfMaterial[]; itemId: string }) => ({
        url: `sor-bill-of-materials/bulk-create`,
        method: 'POST',
        body: { boqs: args.boqs, itemId: args.itemId },
      }),
      invalidatesTags: ['boq-bulk-create'],
    }),
  }),
});

export const { useSaveBoqMutation } = sorBillOfMaterialBulkCreateApi;

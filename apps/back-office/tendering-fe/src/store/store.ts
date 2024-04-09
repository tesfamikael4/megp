import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { approveSpdApi } from '@/app/(features)/spd/_api/approve-spd.api';
import { templateSpdApi } from '@/app/(features)/spd/_api/template-spd.api';
import { technicalScoringTreeApi } from '@/app/(features)/spd/_api/technical-scoring-tree.api';
import { sorBillOfMaterialTreeApi } from '@/app/(features)/preparation/_api/item/bill-of-material-tree.api';
import { approveTenderApi } from '@/app/(features)/preparation/_api/tender/approve-tender.api';
import { sorDocumentApi } from '@/app/(features)/preparation/_api/item/sor-document.api';
import { contractFormSpdApi } from '@/app/(features)/spd/_api/contract-form-upload.api';
import { sorBillOfMaterialBulkCreateApi } from '@/app/(features)/preparation/_api/item/bill-of-material-bulk-create.api';
import { getClassificationApi } from '@/app/(features)/preparation/_api/tender/get-classification.api';
import { tenderTemplateApi } from '@/app/(features)/preparation/_api/tender/tender-template.api';
import { bidDocumentApi } from '@/app/(features)/revision/_api/bid-document.api';
const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [approveSpdApi.reducerPath]: approveSpdApi.reducer,
    [tenderingApi.reducerPath]: tenderingApi.reducer,
    [technicalScoringTreeApi.reducerPath]: technicalScoringTreeApi.reducer,
    [sorBillOfMaterialTreeApi.reducerPath]: sorBillOfMaterialTreeApi.reducer,
    [templateSpdApi.reducerPath]: templateSpdApi.reducer,
    [approveTenderApi.reducerPath]: approveTenderApi.reducer,
    [sorDocumentApi.reducerPath]: sorDocumentApi.reducer,
    [contractFormSpdApi.reducerPath]: contractFormSpdApi.reducer,
    [getClassificationApi.reducerPath]: getClassificationApi.reducer,
    [tenderTemplateApi.reducerPath]: tenderTemplateApi.reducer,
    [sorBillOfMaterialBulkCreateApi.reducerPath]:
      sorBillOfMaterialBulkCreateApi.reducer,
    [bidDocumentApi.reducerPath]: bidDocumentApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      approveSpdApi.middleware,
      technicalScoringTreeApi.middleware,
      sorBillOfMaterialTreeApi.middleware,
      templateSpdApi.middleware,
      approveTenderApi.middleware,
      sorDocumentApi.middleware,
      contractFormSpdApi.middleware,
      getClassificationApi.middleware,
      tenderTemplateApi.middleware,
      sorBillOfMaterialBulkCreateApi.middleware,
      bidDocumentApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

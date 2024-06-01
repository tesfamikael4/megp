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
import { tenderingApi } from './api/tendering/tendering.api';
import { bidDocumentApi } from '@/app/(features)/revision/_api/bid-document.api';
import { iamApi } from './api/iam/iam-api';
import { preliminaryComplianceApi } from './api/tendering/preliminary-compliance.api';
import { tenderOpeningApi } from './api/tendering/tender-opening.api';
import { technicalQualification } from './api/tendering/technical-qualification';
import { technicalResponsiveness } from './api/tendering/technical-responsiveness.api';
import {
  procurementRequisitionApi,
  readvertTendersApi,
} from '@/app/(features)/preparation/_api/tender/procurement-requisition.api';
import { technicalScoring } from './api/tendering/technical-scoring.api';
import { tenderingApprovalApi } from './api/tendering-approval/tendering-approval';
import { tenderingIamApi } from './api/tendering-approval/tendering-iam';
import { workflowApi } from './api/workflow/workflow.api';
import { getSubmittedBiddersApi } from '@/app/(features)/solicitation/_api/submitted-bidders.api';
import { bidPriceEvaluation } from './api/tendering/bid-price-evaluation';
const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [approveSpdApi.reducerPath]: approveSpdApi.reducer,
    [tenderingApi.reducerPath]: tenderingApi.reducer,
    [preliminaryComplianceApi.reducerPath]: preliminaryComplianceApi.reducer,
    [technicalQualification.reducerPath]: technicalQualification.reducer,
    [technicalResponsiveness.reducerPath]: technicalResponsiveness.reducer,
    [technicalScoring.reducerPath]: technicalScoring.reducer,
    [bidPriceEvaluation.reducerPath]: bidPriceEvaluation.reducer,
    [tenderOpeningApi.reducerPath]: tenderOpeningApi.reducer,
    [iamApi.reducerPath]: iamApi.reducer,
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
    [procurementRequisitionApi.reducerPath]: procurementRequisitionApi.reducer,
    [tenderingApprovalApi.reducerPath]: tenderingApprovalApi.reducer,
    [tenderingIamApi.reducerPath]: tenderingIamApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [readvertTendersApi.reducerPath]: readvertTendersApi.reducer,
    [getSubmittedBiddersApi.reducerPath]: getSubmittedBiddersApi.reducer,
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
      tenderingApi.middleware,
      preliminaryComplianceApi.middleware,
      technicalQualification.middleware,
      technicalResponsiveness.middleware,
      technicalScoring.middleware,
      bidPriceEvaluation.middleware,
      tenderOpeningApi.middleware,
      bidDocumentApi.middleware,
      iamApi.middleware,
      procurementRequisitionApi.middleware,
      tenderingIamApi.middleware,
      tenderingApprovalApi.middleware,
      workflowApi.middleware,
      readvertTendersApi.middleware,
      getSubmittedBiddersApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

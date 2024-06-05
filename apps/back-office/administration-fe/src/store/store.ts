import { configureStore } from '@reduxjs/toolkit';
import entityApi from './entity/api';
import { measurementsApi } from './api/measurements/measurements.api';
import { tagsApi } from './api/tags/tags.api';
import { categoriesApi } from './api/categories/categories.api';
import { classificationApi } from './api/classification/classification.api';
import { taxonomiesApi } from './api/taxonomies/taxonomies.api';
import { workflowIamApi } from './api/workflow/workflow-iam.api';
import { workflowApi } from './api/workflow/workflow.api';
import { budgeCategoryApi } from './api/budget-category/budge-category.api';
import { ruleDesignerApi } from './api/rule/rule.api';
import { iamApi } from './api/iam/iam.api';
import { specApi } from '@/app/(features)/item-master/_api/template.api';
import { itemSubCategorySliceApi } from '@/app/(features)/item-sub-category/_api/item-sub-category';
import { administrationApi } from './api/administration/administration.api';
import { contractCatalogApi } from './api/contract-catalog/contract-catalog.api';
import { getParentApi } from '@/app/(features)/item-category/_api/custom-item-category';

const { reducers, middleware } = entityApi;

export const store = configureStore({
  reducer: {
    ...reducers,
    [measurementsApi.reducerPath]: measurementsApi.reducer,
    [classificationApi.reducerPath]: classificationApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [taxonomiesApi.reducerPath]: taxonomiesApi.reducer,
    [workflowIamApi.reducerPath]: workflowIamApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [budgeCategoryApi.reducerPath]: budgeCategoryApi.reducer,
    [ruleDesignerApi.reducerPath]: ruleDesignerApi.reducer,
    [iamApi.reducerPath]: iamApi.reducer,
    [itemSubCategorySliceApi.reducerPath]: itemSubCategorySliceApi.reducer,
    [specApi.reducerPath]: specApi.reducer,
    [administrationApi.reducerPath]: administrationApi.reducer,
    [contractCatalogApi.reducerPath]: contractCatalogApi.reducer,
    [getParentApi.reducerPath]: getParentApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...middleware,
      measurementsApi.middleware,
      tagsApi.middleware,
      categoriesApi.middleware,
      classificationApi.middleware,
      taxonomiesApi.middleware,
      workflowIamApi.middleware,
      workflowApi.middleware,
      budgeCategoryApi.middleware,
      ruleDesignerApi.middleware,
      iamApi.middleware,
      itemSubCategorySliceApi.middleware,
      specApi.middleware,
      administrationApi.middleware,
      contractCatalogApi.middleware,
      getParentApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

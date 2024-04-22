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
import { itemSubCategorySliceApi } from '@/app/(features)/item-sub-category/_api/item-sub-category';

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
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

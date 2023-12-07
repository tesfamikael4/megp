'use client';

import { BudgetPlanActivities } from '@/models/budget-plan-activities';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { notifications } from '@mantine/notifications';
import {
  useCreateMutation,
  useDeleteMutation,
  useLazyReadQuery,
  useUpdateMutation,
} from '../_api/activities.api';
import {
  useCreateMutation as useCreatePostActivityMutation,
  useDeleteMutation as useDeletePostActivityMutation,
  useLazyReadQuery as useLazyReadPostActivityQuery,
  useUpdateMutation as useUpdatePostActivityMutation,
} from '../_api/post-activity.api';
import { useParams, useRouter } from 'next/navigation';
import { FrameworkSelector } from './framework-selector';

interface FormDetailProps {
  mode: 'detail' | 'new';
  page: 'pre' | 'post';
}

const activitiesSchema: ZodType<Partial<BudgetPlanActivities>> = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  procurementMethod: z.string({
    required_error: 'Procurement Method is required',
  }),
  procurementType: z.string({
    required_error: 'Procurement Type is required',
  }),
  fundingSource: z.string({
    required_error: 'Funding Source  is required',
  }),
  currency: z.string({
    required_error: 'Currency is required',
  }),
  totalEstimatedAmount: z.number({
    required_error: 'Estimated Amount is required',
  }),
  procurementProcess: z.string({
    required_error: 'Procurement Process is required',
  }),
  preference: z.string().default('Not Applicable'),
  remark: z.string().default(''),
  isMultiYear: z.boolean().default(false),
});

export const FormDetail = ({ mode, page }: FormDetailProps) => {
  const router = useRouter();
  const { budgetYear: budgetPlanId, id } = useParams();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    register,
    watch,
  } = useForm<BudgetPlanActivities>({
    resolver: zodResolver(activitiesSchema),
  });

  // pre rtk query
  const [createPre, { isLoading: isPreCreating }] = useCreateMutation();
  const [getPreActivity, { data: preActivity, isSuccess: isPreSuccess }] =
    useLazyReadQuery();
  const [updatePre, { isLoading: isPreUpdating }] = useUpdateMutation();
  const [removePre, { isLoading: isPreDeleting }] = useDeleteMutation();
  // post rtk query
  const [createPost, { isLoading: isPostCreating }] =
    useCreatePostActivityMutation();
  const [getPostActivity, { data: postActivity, isSuccess: isPostSuccess }] =
    useLazyReadPostActivityQuery();
  const [updatePost, { isLoading: isPostUpdating }] =
    useUpdatePostActivityMutation();
  const [removePost, { isLoading: isPostDeleting }] =
    useDeletePostActivityMutation();

  const method = watch('procurementMethod');

  //event handler
  const onCreate = async (data) => {
    const rawData =
      page == 'pre'
        ? {
            ...data,
            multiYearBudget: [],
            donor: {},
            preBudgetPlanId: budgetPlanId,
          }
        : {
            ...data,
            multiYearBudget: [],
            donor: {},
            postBudgetPlanId: budgetPlanId,
          };
    logger.log(rawData);

    try {
      if (page == 'pre') {
        const res = await createPre(rawData).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Activity created success-fully',
          color: 'green',
        });
        router.push(`/pre-budget-plan/${budgetPlanId}/activities/${res.id}`);
      } else {
        const res = await createPost(rawData).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Activity created success-fully',
          color: 'green',
        });
        router.push(`/post-budget-plan/${budgetPlanId}/activities/${res.id}`);
      }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      if (page == 'pre') {
        await removePre(id as string).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Deleted Success-fully',
          color: 'green',
        });
        router.push(`/pre-budget-plan/${budgetPlanId}/activities/`);
      } else {
        await removePost(id as string).unwrap();
        notifications.show({
          title: 'Success',
          message: 'Deleted Success-fully',
          color: 'green',
        });
        router.push(`/post-budget-plan/${budgetPlanId}/activities/`);
      }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };

  const onUpdate = async (newData) => {
    const rawData =
      page === 'pre'
        ? {
            id,
            ...preActivity,
            ...newData,
            preBudgetPlanId: budgetPlanId,
          }
        : {
            id,
            ...postActivity,
            ...newData,
            postBudgetPlanId: budgetPlanId,
          };
    try {
      if (page == 'pre') {
        await updatePre(rawData);
        notifications.show({
          title: 'Success',
          message: 'Activity Updated Success-fully',
          color: 'green',
        });
      } else {
        await updatePost(rawData);
        notifications.show({
          title: 'Success',
          message: 'Activity Updated Success-fully',
          color: 'green',
        });
      }
    } catch (err) {
      logger.log(err);
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };

  const onReset = () => {
    reset({
      name: '',
      procurementReference: '',
      description: '',
      procurementMethod: '',
      procurementType: '',
    });
  };

  useEffect(() => {
    if (mode === 'detail') {
      page === 'pre' && getPreActivity(id as string);
      page === 'post' && getPostActivity(id as string);
    }
  }, [mode, id, getPreActivity, page, getPostActivity]);

  useEffect(() => {
    method === 'Purchased Orders' && setValue('totalEstimatedAmount', 0);
  }, [method]);

  useEffect(() => {
    if (mode === 'detail' && (isPreSuccess || isPostSuccess)) {
      if (page == 'pre') {
        setValue('name', preActivity?.name);
        setValue('currency', preActivity?.currency);
        setValue('description', preActivity?.description);
        setValue('fundingSource', preActivity?.fundingSource);
        setValue('isMultiYear', preActivity?.isMultiYear);
        setValue('isMultiYear', preActivity?.isMultiYear);
        setValue('procurementMethod', preActivity?.procurementMethod);
        setValue('procurementReference', preActivity?.procurementReference);
        setValue('procurementType', preActivity?.procurementType);
        setValue('remark', preActivity?.remark);
        setValue('preference', preActivity?.preference);
        setValue('procurementProcess', preActivity?.procurementProcess);
        setValue('totalEstimatedAmount', preActivity?.totalEstimatedAmount);
      }
      if (page == 'post') {
        setValue('name', postActivity?.name);
        setValue('currency', postActivity?.currency);
        setValue('description', postActivity?.description);
        setValue('fundingSource', postActivity?.fundingSource);
        setValue('isMultiYear', postActivity?.isMultiYear);
        setValue('isMultiYear', postActivity?.isMultiYear);
        setValue('procurementMethod', postActivity?.procurementMethod);
        setValue('procurementReference', postActivity?.procurementReference);
        setValue('procurementType', postActivity?.procurementType);
        setValue('remark', postActivity?.remark);
        setValue('preference', postActivity?.preference);
        setValue('procurementProcess', postActivity?.procurementProcess);
        setValue('totalEstimatedAmount', postActivity?.totalEstimatedAmount);
      }
    }
  }, [
    mode,
    isPreSuccess,
    postActivity,
    setValue,
    isPostSuccess,
    page,
    preActivity,
  ]);

  return (
    <Stack>
      <TextInput
        label="Name"
        withAsterisk
        {...register('name')}
        error={errors.name?.message}
      />

      <Textarea
        label="Description"
        withAsterisk
        autosize
        minRows={2}
        maxRows={10}
        {...register('description')}
        error={errors.description?.message}
      />

      <Flex gap="md">
        <Controller
          name="currency"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              withCheckIcon={false}
              name={name}
              value={value}
              onChange={onChange}
              label="Currency"
              data={['MWK', 'USD', 'EUR', 'KPW']}
              className="w-full"
              withAsterisk
              placeholder="Select Procurement Type"
              error={errors?.currency?.message}
            />
          )}
        />
        <Controller
          name="totalEstimatedAmount"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Estimated Amount"
              name={name}
              value={value}
              onChange={(d) => onChange(parseInt(d as string))}
              className="w-full"
              error={errors?.totalEstimatedAmount?.message}
              withAsterisk
              disabled={method === 'Purchased Orders'}
            />
          )}
        />
      </Flex>

      <Checkbox
        label="is Multi Year"
        className="w-full"
        {...register('isMultiYear')}
      />

      <Textarea
        label="Remark"
        autosize
        minRows={2}
        maxRows={10}
        {...register('remark')}
      />

      <Divider label="Procurement Mechanization" />

      <Flex gap="md">
        <Controller
          name="procurementMethod"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <Select
              withCheckIcon={false}
              name={name}
              value={value}
              onChange={onChange}
              label="Procurement Method"
              data={[
                'Request for Quotation (RFQ) ',
                'National Competitive Bidding (NCB)',
                'International Competitive Bidding (ICB) ',
                'Request for Proposal (RFP) ',
                'Single Source Procurement ',
                'Framework',
                'Purchased Orders',
              ]}
              className="w-full"
              withAsterisk
              placeholder="Select Procurement Method"
              error={errors?.procurementMethod?.message}
            />
          )}
        />
        <Controller
          name="procurementType"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              withCheckIcon={false}
              name={name}
              value={value}
              onChange={onChange}
              label="Procurement Type"
              data={[
                'Goods',
                'Works',
                'Non Consulting Services',
                'Consultancy Services',
                'Motor Vehicle Repair',
              ]}
              className="w-full"
              withAsterisk
              placeholder="Select Procurement Type"
              error={errors?.procurementType?.message}
            />
          )}
        />
      </Flex>
      {method === 'Purchased Orders' && <FrameworkSelector />}
      <Flex gap="md" align="center">
        <Controller
          name="fundingSource"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              withCheckIcon={false}
              name={name}
              value={value}
              onChange={onChange}
              label="Funding Source"
              data={['Loan', 'Internal Revenue', 'Treasury']}
              className="w-full"
              withAsterisk
              placeholder="Select Funding Source"
              error={errors?.fundingSource?.message}
            />
          )}
        />
        <Controller
          name="procurementProcess"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              label="Procurement Process"
              data={['Online', 'Offline']}
              className="w-full"
              withCheckIcon={false}
              error={errors?.procurementProcess?.message}
              withAsterisk
            />
          )}
        />
      </Flex>
      <Flex gap="md">
        <Controller
          name="preference"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              withCheckIcon={false}
              name={name}
              value={value}
              onChange={onChange}
              label="Supplier Target Group"
              data={[
                { value: 'Not Applicable', label: 'Not Applicable' },
                { value: 'IBM', label: 'Indigenous Black Malawian' },
                { value: 'MSME', label: 'Micro, Small And Medium Enterprises' },
                { value: 'Marginalized Group', label: 'Marginalized Group' },
                { value: 'Others', label: 'Others' },
              ]}
              className="w-full"
            />
          )}
        />

        <Select
          withCheckIcon={false}
          label="Status"
          value="Draft"
          disabled
          data={['Draft']}
          className="w-full"
        />
      </Flex>

      <EntityButton
        mode={mode}
        isSaving={isPreCreating || isPostCreating}
        isUpdating={isPreUpdating || isPostUpdating}
        isDeleting={isPreDeleting || isPostDeleting}
        onCreate={handleSubmit(onCreate)}
        onReset={onReset}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
      />
    </Stack>
  );
};

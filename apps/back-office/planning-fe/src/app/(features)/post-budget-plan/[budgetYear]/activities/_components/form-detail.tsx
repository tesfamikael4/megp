'use client';

import { PreBudgetPlanActivities } from '@/models/pre-budget-plan-activities';
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
import { MultiFieldInput } from './multi-field-input';
import { notifications } from '@mantine/notifications';
import {
  useCreateMutation,
  useDeleteMutation,
  useLazyReadQuery,
  useUpdateMutation,
} from '../_api/activities.api';
import { useParams, useRouter } from 'next/navigation';
import { FrameworkSelector } from './framework-selector';

interface FormDetailProps {
  mode: 'detail' | 'new';
}

const activitiesSchema: ZodType<Partial<PreBudgetPlanActivities>> = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  // procurementReference: z
  //   .string()
  //   .min(1, { message: 'Procurement Reference is required' }),
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
  preference: z.string().default(''),
  remark: z.string().default(''),
  isMultiYear: z.boolean().default(false),
});

export const FormDetail = ({ mode }: FormDetailProps) => {
  const router = useRouter();
  const { budgetYear: preBudgetPlanId, id } = useParams();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    register,
    watch,
  } = useForm<PreBudgetPlanActivities>({
    resolver: zodResolver(activitiesSchema),
  });

  //rtk query
  const [create, { isLoading: isCreating }] = useCreateMutation();
  const [getActivity, { data, isSuccess }] = useLazyReadQuery();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const method = watch('procurementMethod');

  //event handler
  const onCreate = async (data) => {
    const rawData = {
      ...data,
      multiYearBudget: {},
      donor: {},
      preBudgetPlanId: preBudgetPlanId,
    };
    logger.log(rawData);

    try {
      const res = await create(rawData).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Activity created success-fully',
        color: 'green',
      });
      router.push(`/post-budget-plan/${preBudgetPlanId}/activities/${res.id}`);
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
      await remove(id as string).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Deleted Success-fully',
        color: 'green',
      });
      router.push(`/post-budget-plan/${preBudgetPlanId}/activities/`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };

  const onUpdate = async (newData) => {
    const rawData = {
      id,
      ...data,
      ...newData,
      preBudgetPlanId: preBudgetPlanId,
    };
    try {
      await update(rawData);
      notifications.show({
        title: 'Success',
        message: 'Activity Updated Success-fully',
        color: 'green',
      });
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
    mode === 'detail' && getActivity(id as string);
  }, [mode, id, getActivity]);

  useEffect(() => {
    if (mode === 'detail' && isSuccess) {
      setValue('name', data.name);
      setValue('currency', data.currency);
      setValue('description', data.description);
      setValue('fundingSource', data.fundingSource);
      setValue('isMultiYear', data.isMultiYear);
      setValue('isMultiYear', data.isMultiYear);
      setValue('procurementMethod', data.procurementMethod);
      setValue('procurementReference', data.procurementReference);
      setValue('procurementType', data.procurementType);
      setValue('remark', data.remark);
      setValue('preference', data.preference);
    }
  }, [mode, isSuccess, data, setValue]);

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
              data={['USD', 'EUR', 'MWK']}
              className="w-full"
              withAsterisk
              placeholder="Select Procurement Type"
              error={errors?.currency?.message}
            />
          )}
        />
        <NumberInput label="Estimated Amount" className="w-full" />
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
                'Signed Framework Contract',
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
      {method === 'Signed Framework Contract' && <FrameworkSelector />}
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
        <Select
          label="Procurement Process"
          data={['Online', 'Offline']}
          className="w-full"
          withCheckIcon={false}
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
                { label: 'Indigenous Black Malawian', value: 'IBM' },
                { value: 'MSME', label: 'Micro, Small And Medium Enterprises' },
                { value: 'MG', label: 'Marginalized Group' },
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
        isSaving={isCreating}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        onCreate={handleSubmit(onCreate)}
        onReset={onReset}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
      />
    </Stack>
  );
};

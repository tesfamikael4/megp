'use client';

import { PreBudgetPlanActivities } from '@/models/pre-budget-plan-activities';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  Divider,
  Flex,
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
  useLazyReadQuery,
  useUpdateMutation,
} from '../_api/activities.api';
import { useParams, useRouter } from 'next/navigation';

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
  remark: z.string().default(''),
  isMultiYear: z.boolean().default(false),
  indigenousPreference: z.boolean().default(false),
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
    watch,
    register,
  } = useForm<PreBudgetPlanActivities>({
    resolver: zodResolver(activitiesSchema),
  });
  const isMultiYear = watch('isMultiYear');
  const indigenousPreference = watch('indigenousPreference');
  const fundingSource = watch('fundingSource');
  const [budgetYear, setBudgetYear] = useState({});
  const [donors, setDonors] = useState({});
  const [preferenceValue, setPreferenceValue] = useState({
    msme: '',
    ibm: '',
    mg: '',
  });

  //rtk query
  const [create, { isLoading: isCreating }] = useCreateMutation();
  const [getActivity, { data, isSuccess }] = useLazyReadQuery();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  //event handler
  const onCreate = async (data) => {
    const rawData = {
      ...data,
      multiYearBudget: data.isMultiYear ? budgetYear : {},
      donor: data.fundingSource == 'Treasury' ? {} : donors,
      preferenceValue: data.indigenousPreference ? preferenceValue : {},
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
      router.push(`/pre-budget-plan/${preBudgetPlanId}/activities/${res.id}`);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    }
  };

  const onUpdate = async (data) => {
    const rawData = {
      id,
      ...data,
      multiYearBudget: data.isMultiYear ? budgetYear : {},
      donor: data.fundingSource == 'Treasury' ? {} : donors,
      preferenceValue: data.indigenousPreference ? preferenceValue : {},
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
      setValue('indigenousPreference', data.indigenousPreference);
      setValue('isMultiYear', data.isMultiYear);
      setValue('isMultiYear', data.isMultiYear);
      setValue('procurementMethod', data.procurementMethod);
      setValue('procurementReference', data.procurementReference);
      setValue('procurementType', data.procurementType);
      setValue('remark', data.remark);
      setBudgetYear({ ...data.multiYearBudget });
      setPreferenceValue({ ...data.preferenceValue });
      setDonors({ ...data.donor });
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
      {/* <TextInput
        label="Procurement Reference"
        withAsterisk
        {...register('procurementReference')}
        error={errors.procurementReference?.message}
      /> */}
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
          name="procurementMethod"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <Select
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
                'Single Source Procurement (Emergency)',
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
        <Controller
          name="fundingSource"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              label="Funding Source"
              data={['Loan', 'IR', 'Treasury']}
              className="w-full"
              withAsterisk
              placeholder="Select Funding Source"
              error={errors?.fundingSource?.message}
            />
          )}
        />
      </Flex>
      <Flex gap="md" align="center">
        <Checkbox
          label="is Multi Year"
          className="w-full"
          {...register('isMultiYear')}
        />
        <Checkbox
          label="Indigenous Preference"
          className="w-full"
          {...register('indigenousPreference')}
        />
        <Controller
          name="currency"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              label="Currency"
              data={['USD', 'EUR', 'Non Consulting Services']}
              className="w-full"
              withAsterisk
              placeholder="Select Procurement Type"
              error={errors?.currency?.message}
            />
          )}
        />
      </Flex>
      {isMultiYear && (
        <MultiFieldInput
          filed1Label="Budget Year"
          field2Label="Allocated Budget"
          value={budgetYear}
          onChange={setBudgetYear}
          withAsterisk
        />
      )}
      {indigenousPreference && (
        <>
          <Divider my="xs" label="Preference" labelPosition="left" />
          <Flex gap="md">
            <TextInput
              value="MSME"
              label="Preference"
              className="w-full"
              disabled
            />
            <TextInput
              type="number"
              label="Allocated Percentage"
              className="w-full"
              rightSection="%"
              value={preferenceValue.msme}
              onChange={(data) =>
                setPreferenceValue({
                  ...preferenceValue,
                  msme: data.target.value,
                })
              }
            />
          </Flex>
          <Flex gap="md">
            <TextInput value="IBM" className="w-full" disabled />
            <TextInput
              type="number"
              className="w-full"
              rightSection="%"
              value={preferenceValue.ibm}
              onChange={(data) =>
                setPreferenceValue({
                  ...preferenceValue,
                  ibm: data.target.value,
                })
              }
            />
          </Flex>
          <Flex gap="md">
            <TextInput value="Marginalized Group" className="w-full" disabled />
            <TextInput
              type="number"
              className="w-full"
              rightSection="%"
              value={preferenceValue.mg}
              onChange={(data) =>
                setPreferenceValue({
                  ...preferenceValue,
                  mg: data.target.value,
                })
              }
            />
          </Flex>
        </>
      )}

      {fundingSource && fundingSource !== 'Treasury' && (
        <MultiFieldInput
          filed1Label="Donors"
          field2Label="Amount"
          value={donors}
          onChange={setDonors}
        />
      )}

      <Textarea
        label="Remark"
        autosize
        minRows={2}
        maxRows={10}
        {...register('remark')}
      />

      <EntityButton
        mode={mode}
        isSaving={isCreating}
        isUpdating={isUpdating}
        onCreate={handleSubmit(onCreate)}
        onReset={onReset}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onCreate)}
      />
    </Stack>
  );
};

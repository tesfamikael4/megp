'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Checkbox,
  Flex,
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { Section, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import {
  useCreateMutation,
  useDeleteMutation,
  useLazyReadQuery,
  useUpdateMutation,
} from '../_api/procurement-requisition.api';
import { useParams, useRouter } from 'next/navigation';
import { useGetCurrenciesQuery } from '@/store/api/administration/administration.api';
import { useGetPostBudgetPlansQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';

import { ProcurementRequisition } from '@/models/procurement-requsition';

interface FormDetailProps {
  mode: 'detail' | 'new';
  disableFields?: boolean;
}

const prSchema: ZodType<Partial<ProcurementRequisition>> = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),

  currency: z.string({
    required_error: 'Currency is required',
  }),
  totalEstimatedAmount: z.coerce.number({
    required_error: 'Estimated Amount is required',
  }),
  remark: z.string().default(''),
  isMultiYear: z.boolean().default(false),
  procurementApplication: z.string({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required to be a string',
  }),
  postBudgetPlanId: z.string(),
});

export const FormDetail = ({
  mode,
  disableFields = false,
}: FormDetailProps) => {
  const router = useRouter();
  const { id } = useParams();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    register,
  } = useForm<ProcurementRequisition>({
    resolver: zodResolver(prSchema),
  });

  const { data: budgetYear } = useGetPostBudgetPlansQuery(undefined);
  //

  const { data: currency } = useGetCurrenciesQuery({} as any);

  // pr rtk query
  const [create, { isLoading: isCreating }] = useCreateMutation();
  const [
    getPr,
    {
      data: procurementRequisition,
      isSuccess: isPrSuccess,
      isLoading: isPrLoading,
    },
  ] = useLazyReadQuery();
  const [updatePr, { isLoading: isPrUpdating }] = useUpdateMutation();
  const [removePr, { isLoading: isPrDeleting }] = useDeleteMutation();

  // configs;

  //event handler
  const onCreate = async (data) => {
    try {
      const res = await create({
        ...data,
      }).unwrap();
      notify('Success', 'Procurement Requisition created Successfully');
      router.push(`/procurement-requisition/${res.id}`);
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };
  const onDelete = async () => {
    try {
      await removePr(id as string).unwrap();
      notify('Success', 'Deleted Successfully');
      router.push(`/procurement-requisition`);
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  const onUpdate = async (newData) => {
    const rawData = {
      id,

      ...newData,
    };

    try {
      await updatePr(rawData).unwrap();
      notify('Success', 'Procurement Requisition Updated Successfully');
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  const onReset = () => {
    reset({
      name: '',
      description: '',
    });
  };

  useEffect(() => {
    if (mode === 'detail') {
      getPr(id as string);
    }
  }, [mode, id, getPr]);

  useEffect(() => {
    if (mode === 'detail' && isPrSuccess) {
      setValue('name', procurementRequisition?.name);
      setValue('currency', procurementRequisition?.currency);
      setValue('description', procurementRequisition?.description);
      setValue('isMultiYear', procurementRequisition?.isMultiYear);
      setValue(
        'requisitionReferenceNumber',
        procurementRequisition?.procurementReference,
      );
      setValue('remark', procurementRequisition?.remark);
      setValue(
        'totalEstimatedAmount',
        procurementRequisition?.totalEstimatedAmount,
      );

      setValue(
        'procurementApplication',
        procurementRequisition?.procurementApplication,
      );
      setValue('postBudgetPlanId', procurementRequisition?.postBudgetPlanId);
    }
  }, [mode, isPrSuccess, setValue, procurementRequisition]);

  return (
    <Section title="Procurement Requisition Identification" collapsible={false}>
      <Stack pos={'relative'}>
        <Flex gap="md" pos={'relative'}>
          <Box className="w-1/2">
            {mode == 'detail' && <LoadingOverlay visible={isPrLoading} />}

            <TextInput
              withAsterisk
              disabled
              label="Reference Number"
              {...register('requisitionReferenceNumber')}
            />

            <TextInput
              label="Name"
              withAsterisk
              {...register('name')}
              error={errors.name?.message}
              disabled={disableFields}
            />
            <Controller
              name="currency"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <Select
                  withCheckIcon={false}
                  name={name}
                  value="MKW"
                  onChange={onChange}
                  label="Currency"
                  data={currency?.items?.map((c) => c.abbreviation) ?? []}
                  className="w-full"
                  withAsterisk
                  searchable
                  placeholder="Select Currency"
                  error={errors?.currency?.message}
                  disabled
                />
              )}
            />
            <Checkbox
              label="is Multi Year"
              className="w-full mt-4 mb-2"
              {...register('isMultiYear')}
              disabled={disableFields}
            />
            <TextInput
              label="Estimated Amount"
              className="w-full"
              {...register('totalEstimatedAmount')}
              error={errors?.totalEstimatedAmount?.message}
              withAsterisk
              type="number"
              disabled={disableFields}
            />

            <Controller
              name="postBudgetPlanId"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  name="name"
                  value={value}
                  onChange={onChange}
                  data={budgetYear?.items.map((b) => {
                    return {
                      value: b.id,
                      label: b.app.budgetYear,
                    };
                  })}
                  label="Budget Year"
                  placeholder="Select Budget Year"
                  withAsterisk
                  error={errors?.postBudgetPlanId?.message}
                  disabled={disableFields}
                />
              )}
            />
          </Box>
          <Box className="w-1/2">
            <Controller
              name="procurementApplication"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  name="name"
                  label="Procured By"
                  value={value}
                  disabled={disableFields}
                  withAsterisk
                  error={
                    errors?.procurementApplication
                      ? errors?.procurementApplication?.message?.toString()
                      : ''
                  }
                  onChange={onChange}
                  data={[
                    {
                      value: 'tendering',
                      label: 'Tendering',
                    },
                    {
                      value: 'purchasing',
                      label: 'Purchasing',
                    },
                    {
                      value: 'auctioning',
                      label: 'Auctioning',
                    },
                  ]}
                  placeholder="select Procurement Application"
                />
              )}
            />
            <Textarea
              label="Description"
              withAsterisk
              autosize
              minRows={5}
              maxRows={5}
              {...register('description')}
              error={errors.description?.message}
              disabled={disableFields}
            />
            <Textarea
              label="Remark"
              autosize
              minRows={4}
              maxRows={4}
              {...register('remark')}
              disabled={disableFields}
              className="mt-2"
            />
          </Box>
        </Flex>

        <EntityButton
          mode={mode}
          isSaving={isCreating}
          isUpdating={isPrUpdating}
          isDeleting={isPrDeleting}
          onCreate={handleSubmit(onCreate)}
          onReset={onReset}
          onUpdate={handleSubmit(onUpdate)}
          onDelete={handleSubmit(onDelete)}
          disabled={disableFields}
        />
      </Stack>
    </Section>
  );
};

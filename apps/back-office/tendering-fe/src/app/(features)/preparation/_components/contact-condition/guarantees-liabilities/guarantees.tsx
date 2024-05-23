import { GuaranteesForm } from '@/models/contract-condition/guararentee-form.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  Flex,
  LoadingOverlay,
  MultiSelect,
  NativeSelect,
  NumberInput,
  Stack,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '../../../_api/scc/guarantees';
import { useListQuery } from '../../../_api/scc/curencies.api';

const guarenteeFormData = [
  {
    id: '1',
    name: 'Bank Guarantee',
  },
  {
    id: '2',
    name: 'Insurance Guarantee',
  },
  {
    id: '3',
    name: 'Letter of Credit',
  },
  {
    id: '4',
    name: 'Certified Cheque',
  },
  {
    id: '5',
    name: 'Cash',
  },
];

export default function Guarantees() {
  const { id } = useParams();
  const guaranteesForm: ZodType<Partial<GuaranteesForm>> = z.object({
    guaranteeType: z.enum([
      'Advance Payment Guarantee',
      'Performance Guarantee',
      'Retention Guarantee',
    ]),
    guaranteeRequired: z.boolean(),
    guaranteePercentage: z
      .number()
      .nonnegative()
      .lte(100)
      .min(1, { message: 'Guarantee Percentage is required ' }),
    currency: z.string({ required_error: 'Currency is required' }),
    guaranteeForm: z
      .array(
        z.enum([
          'Bank Guarantee',
          'Insurance Guarantee',
          'Letter of Credit',
          'Certified Cheque',
          'Cash',
        ]),
      )
      .min(1, { message: 'This feild is required' }),
    validityPeriod: z
      .number()
      .min(1, { message: 'Validity period is required' }),
  });

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const {
    data: currencies,
    isLoading: currencyLoading,
    isSuccess,
  } = useListQuery({
    skip: 0,
    take: 300,
  });
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(guaranteesForm),
  });

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
      });
      notify('Success', 'Contract general provision created successfully');
    } catch (err) {
      notify('Error', 'Error in creating contract general provision');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: selected?.id.toString(),
      });
      notify('Success', 'Contract general provision updated successfully');
    } catch {
      notify('Error', 'Error in updating contract general provision');
    }
  };

  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        guaranteeType: selected?.guaranteeType,
        guaranteeRequired: selected?.guaranteeRequired,
        guaranteePercentage: selected?.guaranteePercentage,
        currency: selected?.currency,
        guaranteeForm: selected?.guaranteeForm,
        validityPeriod: selected?.validityPeriod,
      });
    }
  }, [reset, selected, selectedSuccess]);

  return (
    <Stack>
      <LoadingOverlay
        visible={isLoading || isUpdating || isSaving || currencyLoading}
      />
      <Flex gap="md">
        <Checkbox
          label="Guarantee Required"
          className="w-1/2"
          {...register('guaranteeRequired')}
        />
        <NativeSelect
          placeholder="Guarantee Type"
          withAsterisk
          label="Guarantee Type"
          className="w-1/2"
          data={[
            'Advance Payment Guarantee',
            'Performance Guarantee',
            'Retention Guarantee',
          ]}
          error={
            errors['guaranteeType']
              ? errors['guaranteeType']?.message?.toString()
              : ''
          }
          {...register('guaranteeType')}
        />
      </Flex>
      <Flex gap="md">
        <Controller
          name="guaranteePercentage"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Guarantee Percentage"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['guaranteePercentage']
                  ? errors['guaranteePercentage']?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <NativeSelect
          placeholder="Currency"
          withAsterisk
          label="Currency"
          className="w-1/2"
          data={
            isSuccess && currencies && currencies.items.length > 0
              ? currencies.items.map((item: any) => {
                  const value = { ...item };
                  (value['value'] = item.abbreviation),
                    (value['label'] = item.name);
                  return value;
                })
              : []
          }
          error={
            errors['currency'] ? errors['currency']?.message?.toString() : ''
          }
          {...register('currency')}
        />
      </Flex>
      <Flex gap="md">
        <Controller
          name="guaranteeForm"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <MultiSelect
              label="Guarantee Form"
              name={name}
              value={value}
              onChange={onChange}
              className="w-1/2"
              withAsterisk
              data={guarenteeFormData?.map((tag) => ({
                value: tag.name,
                label: tag.name,
              }))}
              searchable
              clearable
              error={errors.guaranteeForm?.message as string | undefined}
            />
          )}
        />
        <Controller
          name="validityPeriod"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Validity Period"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['validityPeriod']
                  ? errors['validityPeriod']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </Flex>
      <EntityButton
        mode={'new'}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={reset}
      />
    </Stack>
  );
}

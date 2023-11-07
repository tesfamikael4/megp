'use client';

import { PreBudgetPlanActivities } from '@/models/pre-budget-plan-activities';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Checkbox,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';

interface FormDetailProps {
  mode: 'detail' | 'new';
}

const activitiesSchema: ZodType<Partial<PreBudgetPlanActivities>> = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  procurementReference: z
    .string()
    .min(1, { message: 'Procurement Reference is required' }),
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
});

export const FormDetail = ({ mode }: FormDetailProps) => {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    // setValue,
    register,
  } = useForm<PreBudgetPlanActivities>({
    resolver: zodResolver(activitiesSchema),
  });

  //event handler
  const onCreate = (data) => {
    logger.log(data);
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
  return (
    <Stack>
      <TextInput
        label="Name"
        withAsterisk
        {...register('name')}
        error={errors.name?.message}
      />
      <TextInput
        label="Procurement Reference"
        withAsterisk
        {...register('procurementReference')}
        error={errors.procurementReference?.message}
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
          name="procurementMethod"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <Select
              name={name}
              value={value}
              onChange={onChange}
              label="Procurement Method"
              data={['Open', 'Limited', 'Selective']}
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
              data={['Buying']}
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
        <Checkbox label="is Multi Year" className="w-full" />
        <Checkbox label="Indigenous Preference" className="w-full" />
        <Select
          label="Donor"
          placeholder="Select Donor"
          data={['Loan', 'IR', 'Treasury']}
          className="w-full"
        />
      </Flex>
      <Flex gap="md">
        <Select
          label="Budget Year"
          placeholder="Select Budget Year"
          data={['2024', '2023', '2022']}
          className="w-full"
          withAsterisk
        />
        <Select
          label="Preference"
          placeholder="Select Preference"
          data={['2024', '2023', '2022']}
          className="w-full"
          withAsterisk
        />
        <Select
          label="Framework Contract"
          placeholder="Select Framework Contract"
          data={['2024', '2023', '2022']}
          className="w-full"
          withAsterisk
        />
      </Flex>
      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate)}
        onReset={onReset}
        onUpdate={handleSubmit(onCreate)}
        onDelete={handleSubmit(onCreate)}
      />
    </Stack>
  );
};

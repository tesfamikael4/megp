import { GeneralProvisionForm } from '@/models/contract-condition/contract-forms.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, NumberInput, Stack, TextInput } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

export default function GeneralProvision() {
  const ContractDatesForm: ZodType<Partial<GeneralProvisionForm>> = z.object({
    contractDuration: z.number().min(1, { message: 'This field is required' }),
    commencementDay: z.number().min(1, { message: 'This field is required' }),
    deliverySite: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(ContractDatesForm),
  });
  const onCreate = () => {
    logger.log('create');
  };

  return (
    <Stack>
      <Flex gap="md">
        <Controller
          name="contractDuration"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Contact Duration"
              max={31}
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['contractDuration']
                  ? errors['contractDuration']?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <Controller
          name="commencementDay"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Commencement Day"
              max={31}
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['commencementDay']
                  ? errors['commencementDay']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </Flex>
      <Flex gap="md">
        <TextInput
          placeholder="Delivery Site"
          withAsterisk
          className="w-1/2"
          label="deliverySite"
          error={
            errors?.deliverySite
              ? errors?.deliverySite?.message?.toString()
              : ''
          }
          {...register('deliverySite')}
        />
      </Flex>
      <EntityButton
        mode={'new'}
        onCreate={handleSubmit(onCreate)}
        onReset={reset}
      />
    </Stack>
  );
}

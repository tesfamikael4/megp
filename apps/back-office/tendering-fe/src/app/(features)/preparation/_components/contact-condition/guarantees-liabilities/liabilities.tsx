import { liabililitesForm } from '@/models/contract-condition/liability-forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, NumberInput, Stack } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

interface LiabililitesFormInterface {
  warrantyPeriod: number;
  postWarrantyServicePeriod: number;
  liquidtyDamage: number;
  liquidtyDamageLimit: number;
}

export default function Liabilities() {
  const liabililitesForm: ZodType<Partial<liabililitesForm>> = z.object({
    warrantyPeriod: z.number(),
    postWarrantyServicePeriod: z.number(),
    liquidtyDamage: z
      .number()
      .min(1, { message: 'Liquidity Damage is required' }),
    liquidtyDamageLimit: z
      .number()
      .min(1, { message: 'Liquidity Damage is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(liabililitesForm),
  });

  const onCreate = () => {
    logger.log('here');
  };

  return (
    <Stack>
      <Flex gap="md">
        <Controller
          name="warrantyPeriod"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Warranty Period"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['warrantyPeriod']
                  ? errors['warrantyPeriod']?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <Controller
          name="postWarrantyServicePeriod"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Post-Warranty Service Period"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['postWarrantyServicePeriod']
                  ? errors['postWarrantyServicePeriod']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </Flex>
      <Flex gap="md">
        <Controller
          name="liquidtyDamage"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Liquidty damage"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['liquidtyDamage']
                  ? errors['liquidtyDamage']?.message?.toString()
                  : ''
              }
            />
          )}
        />
        <Controller
          name="liquidtyDamageLimit"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Post-Warranty Service Period"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['liquidtyDamageLimit']
                  ? errors['liquidtyDamageLimit']?.message?.toString()
                  : ''
              }
            />
          )}
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

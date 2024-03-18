import { zodResolver } from '@hookform/resolvers/zod';
import {
  Flex,
  NativeSelect,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

interface DeliverablesInterface {
  name: string;
  deliverableType: 'GoodsDeliverable' | 'NonGoodsDeliverable';
  contribution: number;
  paymentBasis: 'Deliverable-Based' | 'Period-Based';
}

export default function Deliverables() {
  const DelivarablesForm: ZodType<Partial<DeliverablesInterface>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    deliverableType: z.enum(['GoodsDeliverable', 'NonGoodsDeliverable']),
    contribution: z.number().max(100, { message: 'This field is required' }),
    paymentBasis: z.enum(['Deliverable-Based', 'Period-Based']),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(DelivarablesForm),
  });

  const onCreate = () => {
    logger.log('Delivarables');
  };
  return (
    <Stack>
      <Flex gap={'md'}>
        <TextInput
          label="Name"
          withAsterisk
          className="w-1/2"
          error={errors?.name ? errors?.name?.message?.toString() : ''}
          {...register('name')}
        />
        <NativeSelect
          placeholder="Delivarable Type"
          withAsterisk
          label="Delivarable Type"
          className="w-1/2"
          data={[
            'FromTheTotalCoGoodsDeliverablentractAmount',
            'NonGoodsDeliverable',
          ]}
          error={
            errors['deliverableType']
              ? errors['deliverableType']?.message?.toString()
              : ''
          }
          {...register('deliverableType')}
        />
      </Flex>
      <Flex gap={'md'}>
        <Controller
          name="contribution"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Contribution"
              name={name}
              value={value}
              max={100}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['contribution']
                  ? errors['contribution']?.message?.toString()
                  : ''
              }
              withAsterisk
            />
          )}
        />
        <NativeSelect
          placeholder="Payment Basis"
          withAsterisk
          label="Payment Basis"
          className="w-1/2"
          data={['Deliverable-Based', 'Period-Based']}
          error={
            errors['paymentBasis']
              ? errors['paymentBasis']?.message?.toString()
              : ''
          }
          {...register('paymentBasis')}
        />
      </Flex>

      <EntityButton mode={'new'} onCreate={handleSubmit(onCreate)} />
    </Stack>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, NumberInput, Select, Stack, TextInput } from '@mantine/core';
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

        <Controller
          control={control}
          name="deliverableType"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={[
                'FromTheTotalCoGoodsDeliverablentractAmount',
                'NonGoodsDeliverable',
              ]}
              error={
                errors['deliverableType']
                  ? errors['deliverableType']?.message?.toString()
                  : ''
              }
              label="Delivarable Type"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Delivarable Type"
              searchable
              value={value}
            />
          )}
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
        <Controller
          control={control}
          name="paymentBasis"
          render={({ field: { value, name, onChange } }) => (
            <Select
              data={['Deliverable-Based', 'Period-Based']}
              error={
                errors['paymentBasis']
                  ? errors['paymentBasis']?.message?.toString()
                  : ''
              }
              label="Payment Basis"
              withAsterisk
              name={name}
              className="w-1/2"
              nothingFoundMessage="No options"
              onChange={onChange}
              placeholder="Payment Basis"
              searchable
              value={value}
            />
          )}
        />
      </Flex>

      <EntityButton mode={'new'} onCreate={handleSubmit(onCreate)} />
    </Stack>
  );
}

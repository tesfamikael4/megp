import { ContactDeliverablesForm } from '@/models/contract-condition/contract-delivalables';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Flex, NumberInput, MultiSelect } from '@mantine/core';
import { logger } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ZodType, z } from 'zod';

const delivarableList = [
  {
    id: '2',
    name: 'Delivarables one',
  },
  {
    id: '3',
    name: 'Delivarables two',
  },
  {
    id: '4',
    name: 'Deliverables three',
  },
];

export default function ContractDelivarable() {
  const ContractDelivarableForm: ZodType<Partial<ContactDeliverablesForm>> =
    z.object({
      delivarable: z
        .array(z.string({ required_error: 'This field is required' }))
        .min(1, { message: 'This field is required ' }),
      deliverySchedule: z
        .number()
        .min(1, { message: 'This field is required' }),
    });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(ContractDelivarableForm),
  });
  const onCreate = () => {
    logger.log('create');
  };

  return (
    <Stack>
      <Flex gap="md">
        <Controller
          name="delivarable"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <MultiSelect
              label="Delivarable"
              name={name}
              value={value}
              onChange={onChange}
              className="w-1/2"
              withAsterisk
              data={delivarableList?.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              searchable
              clearable
              error={errors.delivarable?.message as string | undefined}
            />
          )}
        />
        <Controller
          name="deliverySchedule"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Delivery Schedule"
              max={31}
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['deliverySchedule']
                  ? errors['deliverySchedule']?.message?.toString()
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

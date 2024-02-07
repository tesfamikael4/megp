'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, Group, Stack, NumberInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';

const budgetSchema: ZodType<Partial<any>> = z.object({
  quarter1: z.number({
    required_error: '1st Quarter is required',
  }),
  quarter2: z.number({
    required_error: '2nd Quarter is required',
  }),
  quarter3: z.number({
    required_error: '3rd Quarter is required',
  }),
  quarter4: z.number({
    required_error: '4th Quarter is required',
  }),
});
export const BudgetForm = ({
  data,
  onDone,
  onRemove,
  disableRemove,
  disableFields,
}: any) => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<any>({
    resolver: zodResolver(budgetSchema),
  });

  //useEffect

  useEffect(() => {
    if (data) {
      setValue('quarter1', parseInt(data.quarter1));
      setValue('quarter2', parseInt(data.quarter2));
      setValue('quarter3', parseInt(data.quarter3));
      setValue('quarter4', parseInt(data.quarter4));
    }
  }, []);
  return (
    <div className="p-5 bg-white">
      <Stack>
        <Flex gap="md">
          <Controller
            control={control}
            name="quarter1"
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                name={name}
                value={value}
                onChange={(e) => onChange(+e)}
                label="1st Quarter"
                withAsterisk
                className="w-full"
                // type="number"
                error={errors?.quarter1?.message?.toString() ?? ''}
                disabled={disableFields}
              />
            )}
          />
          <Controller
            control={control}
            name="quarter2"
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                name={name}
                value={value}
                onChange={(e) => onChange(+e)}
                label="2nd Quarter"
                withAsterisk
                className="w-full"
                // type="number"
                error={errors?.quarter2?.message?.toString() ?? ''}
                disabled={disableFields}
              />
            )}
          />
        </Flex>
        <Flex gap="md">
          <Controller
            control={control}
            name="quarter3"
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                name={name}
                value={value}
                onChange={(e) => onChange(+e)}
                label="3rd Quarter"
                withAsterisk
                className="w-full"
                // type="number"
                error={errors?.quarter3?.message?.toString() ?? ''}
                disabled={disableFields}
              />
            )}
          />
          <Controller
            control={control}
            name="quarter4"
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                name={name}
                value={value}
                onChange={(e) => onChange(+e)}
                label="4th Quarter"
                withAsterisk
                className="w-full"
                // type="number"
                error={errors?.quarter4?.message?.toString() ?? ''}
                disabled={disableFields}
              />
            )}
          />
        </Flex>

        <Group justify="end">
          <Button
            color="red"
            onClick={onRemove}
            disabled={disableRemove || disableFields}
          >
            Remove
          </Button>
          <Button onClick={handleSubmit(onDone)} disabled={disableFields}>
            Done
          </Button>
        </Group>
      </Stack>
    </div>
  );
};

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  Flex,
  LoadingOverlay,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { useCreateMutation } from '../../_api/tender/personnel-list.api';
import { notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { ProfessionalList } from '@/models/tender/lot/personnel';

interface PersonnelFormDetailProp {
  returnFunction: () => void;
}

export default function PersonnelFormDetail({
  returnFunction,
}: PersonnelFormDetailProp) {
  const { id } = useParams();
  const PersonnelFormDetailSchema: ZodType<Partial<ProfessionalList>> =
    z.object({
      position: z.string().min(10, { message: 'Position is required' }),
      evaluated: z.boolean({ required_error: 'Evaluated is required' }),
      order: z.number().min(1, { message: 'order must be one or above' }),
    });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(PersonnelFormDetailSchema),
  });

  const [create, { isLoading }] = useCreateMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
      });
      notify('Success', 'Personnel created successfully');
      returnFunction;
    } catch (err) {
      notify('Error', 'Error in creating Personnel');
    }
  };

  return (
    <Stack pos={'relative'}>
      <LoadingOverlay visible={isLoading} />
      <Flex direction={'column'} gap={'sm'}>
        <TextInput
          withAsterisk
          label="Position"
          error={errors?.position ? errors?.position?.message?.toString() : ''}
          {...register('position')}
        />
        <Checkbox label="Evaluated" {...register('evaluated')} />
        <Controller
          name="order"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Order"
              max={31}
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(d)}
              error={
                errors['order'] ? errors['order']?.message?.toString() : ''
              }
            />
          )}
        />
        <EntityButton
          mode={'new'}
          onCreate={handleSubmit(onCreate)}
          onReset={reset}
        />
      </Flex>
    </Stack>
  );
}

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
import { notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { ProfessionalList } from '@/models/tender/lot/personnel';

interface PersonnelFormDetailProp {
  returnFunction: (data) => void;
}

export default function PersonnelCapabilitiesFormDetail({
  returnFunction,
}: PersonnelFormDetailProp) {
  const { id } = useParams();
  const PersonnelFormDetailSchema: ZodType<Partial<ProfessionalList>> =
    z.object({
      position: z.string().min(1, { message: 'this field is required' }),
      name: z.string().min(1, { message: 'this field is required' }),
      nationality: z.string().min(1, { message: 'this field is required' }),
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

  const onCreate = async (data) => {
    try {
      await returnFunction({
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
      <Flex direction={'column'} gap={'sm'}>
        <TextInput
          withAsterisk
          label="Position"
          error={errors?.position ? errors?.position?.message?.toString() : ''}
          {...register('position')}
        />
        <TextInput
          withAsterisk
          label="Name of candidate"
          error={errors?.name ? errors?.name?.message?.toString() : ''}
          {...register('name')}
        />
        <TextInput
          withAsterisk
          label="Nationality"
          error={
            errors?.nationality ? errors?.nationality?.message?.toString() : ''
          }
          {...register('nationality')}
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

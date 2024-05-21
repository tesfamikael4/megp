import { GeneralProvisionForm } from '@/models/contract-condition/contract-forms.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Flex,
  LoadingOverlay,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '../../../_api/scc/general-provisions';
import { useParams } from 'next/navigation';

export default function GeneralProvision() {
  const { id } = useParams();
  const ContractDatesForm: ZodType<Partial<GeneralProvisionForm>> = z.object({
    contractDuration: z
      .number()
      .nonnegative()
      .min(1, { message: 'This field is required' }),
    commencementDay: z
      .number()
      .nonnegative()
      .min(1, { message: 'This field is required' }),
    deliverySite: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(ContractDatesForm),
  });

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

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
        contractDuration: selected?.contractDuration,
        commencementDay: selected?.commencementDay,
        deliverySite: selected?.deliverySite,
      });
    } else {
      reset({
        contractDuration: 0,
        commencementDay: 0,
        deliverySite: '',
      });
    }
  }, [reset, selected, selectedSuccess]);
  return (
    <Stack>
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <Flex gap="md">
        <Controller
          name="contractDuration"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Contact Duration"
              max={31}
              name={name}
              rightSection={<Text size="sm"> days </Text>}
              rightSectionWidth={'60px'}
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
        mode={selected ? 'detail' : 'new'}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={reset}
      />
    </Stack>
  );
}

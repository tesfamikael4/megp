import { ContactDeliverablesForm } from '@/models/contract-condition/contract-delivalables';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Stack,
  Flex,
  NumberInput,
  MultiSelect,
  LoadingOverlay,
  TagsInput,
} from '@mantine/core';
import { notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '../../../_api/scc/contract-delivarable.api';
import { DateTimePicker } from '@mantine/dates';

const deliverableList = [
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
  const { id } = useParams();
  const ContractDelivarableForm: ZodType<Partial<ContactDeliverablesForm>> =
    z.object({
      deliverable: z
        .array(z.string({ required_error: 'This field is required' }))
        .min(1, { message: 'This field is required ' }),
      deliverySchedule: z
        .number()
        .min(1, { message: 'This field is required' }),
    });
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(ContractDelivarableForm),
  });

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
      });
      notify('Success', 'Contract deliverables created successfully');
    } catch (err) {
      notify('Error', 'Error in creating contract deliverables');
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: selected?.id.toString(),
      });
      notify('Success', 'Contract deliverables updated successfully');
    } catch {
      notify('Error', 'Error in updating contract deliverables');
    }
  };
  useEffect(() => {
    if (selectedSuccess && selected !== undefined) {
      reset({
        deliverable: selected?.deliverable,
        deliverySchedule: selected?.deliverySchedule,
      });
    }
  }, [reset, selected, selectedSuccess]);
  return (
    <Stack>
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <Flex gap="md">
        <Controller
          name="deliverable"
          control={control}
          render={({ field: { value, name, onChange } }) => (
            <TagsInput
              label="Deliverable"
              name={name}
              value={value}
              onChange={onChange}
              className="w-1/2"
              withAsterisk
              placeholder="Add Delivarables"
              error={errors.deliverable?.message as string | undefined}
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
        mode={selected ? 'detail' : 'new'}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={reset}
      />
    </Stack>
  );
}

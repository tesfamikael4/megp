import { Flex, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  useUpdateMutation,
  useLazyReadQuery,
  useCreateMutation,
} from '../_api/unit.api';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MeasurementUnit } from '@/models/measurement-unit';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';

interface FormDetailProps {
  mode: 'new' | 'detail';
  handleCloseModal: () => void;
  measurementId: string;
}

const defaultValues = {
  name: '',
  shortName: '',
};

export function Unit({
  mode,
  handleCloseModal,
  measurementId,
}: FormDetailProps) {
  const unitSchema: ZodType<Partial<MeasurementUnit>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    shortName: z.string().min(1).optional(),
  });

  const { id } = useParams();

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(unitSchema),
  });

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const [trigger, { data: selected, isSuccess, isLoading }] =
    useLazyReadQuery();
  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        measurementId: id?.toString(),
      });

      notify('Success', 'Unit created successfully');
      handleCloseModal();
    } catch (err) {
      notify('Error', 'Errors in creating unit.');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: selected?.id,
      });

      notify('Success', 'Unit updated successfully');
      handleCloseModal();
    } catch {
      notify('Error', 'Errors in updating unit.');
    }
  };

  const onReset = async () => {
    reset({ ...defaultValues });
  };
  useEffect(() => {
    if (mode == 'detail') {
      trigger(measurementId);
    }
  }, [measurementId, trigger, mode]);

  useEffect(() => {
    if (mode == 'detail' && isSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        // code: selected?.code,
        shortName: selected?.shortName,
      });
    }
  }, [mode, reset, selected, isSuccess]);

  return (
    <Stack pos={'relative'}>
      <LoadingOverlay visible={isLoading} />
      <TextInput
        withAsterisk
        label="Name"
        {...register('name')}
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        required
      />
      <TextInput
        // withAsterisk
        label="Short Name"
        {...register('shortName')}
        error={errors?.key ? errors?.key?.message?.toString() : ''}
        // required
      />
      <Flex gap="md" justify="flex-start" align="flex-start" direction="row">
        <EntityButton
          mode={mode}
          onCreate={handleSubmit(onCreate)}
          onUpdate={handleSubmit(onUpdate)}
          onCancel={handleCloseModal}
          onReset={onReset}
          isSaving={isSaving}
          isUpdating={isUpdating}
        />
      </Flex>
    </Stack>
  );
}

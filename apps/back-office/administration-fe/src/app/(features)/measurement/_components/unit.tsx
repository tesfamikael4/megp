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
import { notifications } from '@mantine/notifications';

interface FormDetailProps {
  mode: 'new' | 'detail';
  handleCloseModal: () => void;
  measurementId: string;
}

const defaultValues = {
  name: '',
  abbreviation: '',
};

export function Unit({
  mode,
  handleCloseModal,
  measurementId,
}: FormDetailProps) {
  const unitSchema: ZodType<Partial<MeasurementUnit>> = z.object({
    name: z.string().min(1, 'Name is required'),
    abbreviation: z.string().optional(),
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
      const result = await create({
        ...data,
        measurementId: id?.toString(),
      }).unwrap();

      // Check if the unit of measurement already exists
      if (result.message === 'Unit of Measurement Already Exist.') {
        notifications.show({
          message: 'Unit of Measurement Already Exists',
          title: 'Error',
          color: 'red',
        });
      } else {
        // Handle success
        notifications.show({
          message: 'Unit of Measurement Created Successfully',
          title: 'Success',
          color: 'green',
        });
      }
      handleCloseModal();
    } catch (error) {
      let errorMessage = 'Error occurred while creating Unit of Measurement';

      // Handle other specific error messages
      if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      notifications.show({
        message: errorMessage,
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: selected?.id,
      });

      notify('Success', 'Unit of Measurement Updated Successfully');
      handleCloseModal();
    } catch {
      notify('Error', 'Error in Updating Unit of Measurement.');
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
        abbreviation: selected?.abbreviation,
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
        label="Abbreviation"
        {...register('abbreviation')}
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

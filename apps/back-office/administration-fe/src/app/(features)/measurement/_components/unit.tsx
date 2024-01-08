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
  abbreviation: '',
};

export function Unit({
  mode,
  handleCloseModal,
  measurementId,
}: FormDetailProps) {
  const unitSchema = z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .transform((str) => str.toLowerCase()),
    abbreviation: z
      .string()
      .optional()
      .transform((str) => (str ? str.toLowerCase() : str)),
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
    const transformedData = {
      ...data,
      name: data.name.toLowerCase(),
      abbreviation: data.abbreviation ? data.abbreviation.toLowerCase() : '',
      measurementId: id?.toString(),
    };

    try {
      const result = await create(transformedData).unwrap();

      // Assuming 'result' contains a 'message' field in case of an error
      if (result.message === 'Unit of Measurement Already Exist.') {
        notify('Error', result.message);
      } else {
        notify('Success', 'Unit of Measurement Created Successfully');
        handleCloseModal();
      }
    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      notify('Error', errorMessage);
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

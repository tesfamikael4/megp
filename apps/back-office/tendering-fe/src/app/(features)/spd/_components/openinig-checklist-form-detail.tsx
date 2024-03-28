import {
  Checkbox,
  LoadingOverlay,
  NativeSelect,
  Stack,
  Textarea,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '../_api/opening-checklist.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { OpeningChecklist } from '@/models/spd/opening-checklist.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  pmId: string;
}

export function OpeningChecklistFormDetail({ mode, pmId }: FormDetailProps) {
  const openingMinuteSchema: ZodType<Partial<OpeningChecklist>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    isBoolean: z.boolean(),
    type: z.enum(['technical', 'financial']),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(openingMinuteSchema),
  });
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(pmId?.toString());

  const onCreate = async (data) => {
    logger.log('here');
    try {
      await create({ ...data, spdId: id, preferenceType: '' });
      notify('Success', 'Preference Margin created successfully');
    } catch (err) {
      notify('Error', 'Error in creating preference margin');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString(), spdId: id });
      notify('Success', 'Preference Margin updated successfully');
    } catch {
      notify('Error', 'Error in updating preference margin');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'Preference Margin  deleted successfully');
    } catch {
      notify('Error', 'Error in deleting preference margin');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        isBoolean: selected?.isBoolean,
        type: selected?.type,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Textarea
        label="Name"
        withAsterisk
        autosize
        minRows={2}
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        {...register('name')}
      />

      <div className="flex space-x-4">
        <NativeSelect
          placeholder="Type"
          withAsterisk
          className="w-1/2"
          label="Type"
          data={['technical', 'financial']}
          {...register('type')}
        />
        <Checkbox
          label="Is Boolean"
          className="w-1/2 my-auto"
          {...register('isBoolean')}
        />
      </div>
      <EntityButton
        mode={mode}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </Stack>
  );
}

import { Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';

import { useForm } from 'react-hook-form';
import {
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '../_api/group.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  description: '',
};

export function FormDetail({ mode }: FormDetailProps) {
  const { handleSubmit, reset, register } = useForm({
    defaultValues,
  });

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const onCreate = async (data) => {
    const result = await create(data);
    console.log(data, result);
  };
  const onUpdate = async (data) => {
    const result = await create(update);
    console.log(data, result);
  };
  const onDelete = async (data) => {
    const result = await remove(data);
    console.log(data, result);
  };
  const onReset = async () => {
    reset({ ...defaultValues });
  };

  return (
    <Stack>
      <TextInput withAsterisk label="Name" {...register('name')} />
      <Textarea
        label="Description"
        autosize
        minRows={2}
        {...register('description')}
      />
      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </Stack>
  );
}

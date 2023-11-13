import { LoadingOverlay, Select, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import {
  useCreateMutation,
  useDeleteMutation,
  useListQuery,
  useReadQuery,
  useUpdateMutation,
} from '../_api/item-category';
import { ItemCategory } from '@/models/item-category';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  parentId: '',
};
export function FormDetail({ mode }: FormDetailProps) {
  const itemCategorySchema: ZodType<Partial<ItemCategory>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    parentId: z.string().optional(),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    setValue,
  } = useForm({
    defaultValues,
    resolver: zodResolver(itemCategorySchema),
  });
  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(id?.toString());
  const {
    data: listData,
    isSuccess: listSuccess,
    isLoading: listLoading,
  } = useListQuery();
  const onCreate = async (data) => {
    try {
      await create(data);
      notifications.show({
        message: 'item-Categories created successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'errors in deleting item-Categories.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
      notifications.show({
        message: 'item-Categories updated successfully',
        title: 'Success',
      });
    } catch {
      notifications.show({
        message: 'errors in updating item-Categories.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'item-Categories deleted successfully',
        title: 'Success',
      });
      router.push('/item-Category');
    } catch (err) {
      notifications.show({
        message: 'errors in deleting item-Categories.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onReset = async () => {
    reset({ ...defaultValues });
  };
  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        parentId: selected?.parentId,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || listLoading} />
      <TextInput
        withAsterisk
        label="Name"
        {...register('name')}
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        required
      />
      <Select
        label="Parent"
        data={
          listSuccess
            ? listData.items.map((item) => ({
                value: item.id,
                label: item.name,
              }))
            : []
        }
        {...register('parentId')}
        onChange={async (value) => value && (await setValue('parentId', value))}
        error={errors?.parentId?.message && errors.parentId.message.toString()}
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

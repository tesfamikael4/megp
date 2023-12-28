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
  } = useListQuery({});
  const onCreate = async (data) => {
    try {
      const result = await create(data);
      if ('data' in result) {
        router.push(`/item-category/${result?.data?.id}`);
      }
      notifications.show({
        message: 'Item-Category created successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        message: 'errors in deleting Item-Category.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
      notifications.show({
        message: 'Item-Category Updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'Error in Updating Item-Category.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'Item-Category Deleted Successfully',
        title: 'Success',
      });
      router.push('/item-Category');
    } catch (err) {
      notifications.show({
        message: 'Error in Deleting Item-Category.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onReset = async () => {
    reset({ ...defaultValues });
  };
  const defaultName = listData?.items?.find(
    (item) => item.id === selected?.parentId,
  );
  const parentName = defaultName?.name || '';
  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        parentId: parentName,
      });
    }
  }, [mode, reset, selected, selectedSuccess, parentName]);

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

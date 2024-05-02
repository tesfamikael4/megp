import { LoadingOverlay, Select, Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Controller, useForm } from 'react-hook-form';
import {
  useCreateMutation,
  useDeleteMutation,
  useReadQuery,
  useUpdateMutation,
} from '../_api/item-sub-category';
import { ItemSubCategory } from '@/models/item-sub-category';
import { notify } from '@megp/core-fe';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  description: '',
  parentCategories: '',
};
export function FormDetail({ mode }: FormDetailProps) {
  const itemSubCategorySchema: ZodType<Partial<ItemSubCategory>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().optional(),
    parentCategories: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    defaultValues,
    resolver: zodResolver(itemSubCategorySchema),
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

  const onCreate = async (data) => {
    try {
      const result = await create(data).unwrap();
      if (result && 'id' in result) {
        router.push(`/item-sub-category/${result.id}`);
      }
      notify('Success', 'Item-category Created Successfully');
    } catch (e) {
      notify('Error', 'Something went wrong');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, id: id?.toString() });
      notifications.show({
        message: 'Item-Sub-Category Updated successfully',
        title: 'Success',
        color: 'green',
      });
    } catch {
      notifications.show({
        message: 'Error in Updating Item-Sub-Category.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString()).unwrap();
      notifications.show({
        message: 'Item-Sub-Category Deleted Successfully',
        title: 'Success',
        color: 'green',
      });
      router.push('/item-sub-category');
    } catch (err) {
      notifications.show({
        message: 'Error in Deleting Item-Sub-Category.',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onReset = async () => {
    reset({ ...defaultValues });
  };

  // logger.table('selected', selected);
  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        description: selected?.description,
        parentCategories: selected?.parentCategories,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <TextInput
        withAsterisk
        label="Name"
        {...register('name')}
        error={errors?.name ? errors?.name?.message?.toString() : ''}
      />
      <TextInput label="Description" {...register('description')} />
      <Controller
        name="parentCategories"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label="Category"
            value={value}
            withAsterisk
            data={[
              { value: 'Goods', label: 'Goods' },
              { value: 'Service', label: 'Service' },
              { value: 'Work', label: 'Work' },
            ]}
            onChange={onChange}
            error={
              errors?.parentCategories?.message &&
              errors.parentCategories.message.toString()
            }
          />
        )}
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

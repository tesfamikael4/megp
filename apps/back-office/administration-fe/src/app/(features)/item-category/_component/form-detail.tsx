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
  parentId: null,
};
export function FormDetail({ mode }: FormDetailProps) {
  const itemCategorySchema: ZodType<Partial<ItemCategory>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    // .transform((str) => str.toLowerCase()),
    parentId: z.string().nullable().default(null),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
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

  const parentOptions = listSuccess
    ? listData.items
        .filter((item) => item.id !== id) // Exclude the current item from options
        .map((item) => ({ value: item.id, label: item.name }))
    : [];
  const onCreate = async (data) => {
    try {
      const result = await create(data).unwrap();
      // Check if the response contains an 'id', indicating successful creation
      if (result && 'id' in result) {
        router.push(`/item-category/${result.id}`);
        notifications.show({
          message: 'Item-category Created Successfully',
          title: 'Success',
          color: 'green',
        });
      } else {
        // If the response doesn't contain 'id', it might be an error message
        throw new Error(
          result.message || 'Unexpected response structure from the server',
        );
      }
    } catch (error) {
      // Error handling for both API call failures and manually thrown errors
      let errorMessage =
        error?.data?.message || error?.message || 'Unknown error occurred';

      // Specific check for 'Item-category Already Exist' message
      if (errorMessage === 'Item-category Already Exist.') {
        errorMessage = 'Item-Category Already Exist.';
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
        message: 'Item Category Deleted Successfully',
        title: 'Success',
        color: 'green',
      });
      router.push('/item-category');
    } catch (error) {
      let errorMessage = 'Error In Deleting Item Category.';
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
        parentId: selected?.parentId,
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
      <Controller
        name="parentId"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label="Parent"
            value={value}
            onChange={onChange}
            data={parentOptions}
            error={
              errors?.parentId?.message && errors.parentId.message.toString()
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

import { Select, Stack, TextInput, Textarea } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useListQuery,
  useCreateMutation,
} from '../_api/unit.api';
import { useListQuery as useUnitTypeListQuery } from '../../unit-type/_api/unitType.api';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Unit } from '@/models/unit';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

const defaultValues = {
  name: '',
  typeId: null,
  parentId: null,
  description: '',
};

const unitSchema: ZodType<Partial<Unit>> = z.object({
  name: z.string().min(1, { message: 'This field is required' }),
  typeId: z.string({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required to be a string',
  }),
  description: z.string().optional(),
  parentId: z.string({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required to be a string',
  }),
});

export function FormDetail({ mode }: FormDetailProps) {
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: zodResolver(unitSchema),
  });
  const router = useRouter();
  const { id } = useParams();
  const [parents, setParents] = useState<Unit[]>([]);

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();
  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );
  const { data: list, isSuccess } = useListQuery();
  const { data: unitType } = useUnitTypeListQuery();

  useEffect(() => {
    if (isSuccess) {
      const posibleParent = list?.items?.filter((u: Unit) => {
        return u.id !== id && selected?.parentId !== u.id;
      });
      setParents(posibleParent);
    }
  }, [id, isSuccess, list?.items, selected?.parentId]);

  const onCreate = async (data) => {
    try {
      const result = await create({
        ...data,
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      });
      if ('data' in result) {
        router.push(`/units/${result.data.id}`);
      }
      notifications.show({
        message: 'unit created successfully',
        title: 'Success',
      });
    } catch (err) {
      notifications.show({
        message: 'error in creating unit',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      });
      notifications.show({
        message: 'unit updated successfully',
        title: 'Success',
      });
    } catch {
      notifications.show({
        message: 'error in updating unit',
        title: 'Success',
        color: 'red',
      });
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notifications.show({
        message: 'unit  deleted successfully',
        title: 'Success',
      });
      router.push('/units');
    } catch {
      notifications.show({
        message: 'error in deleting unit',
        title: 'Success',
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
        typeId: selected?.typeId,
        description: selected?.description,
        code: selected?.code,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack>
      <TextInput
        label="Code"
        error={errors?.code ? errors?.code?.message?.toString() : ''}
        disabled
        {...register('code')}
      />

      <TextInput
        withAsterisk
        label="Name"
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        {...register('name')}
      />

      <Textarea
        label="Description"
        autosize
        minRows={2}
        {...register('description')}
      />

      <Controller
        name="typeId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            name="name"
            label="unit Type"
            value={value}
            withAsterisk
            error={errors?.typeId ? errors?.typeId?.message?.toString() : ''}
            onChange={onChange}
            data={
              unitType?.items?.map((type) => ({
                value: type?.id,
                label: type?.name,
              })) || []
            }
          />
        )}
      />

      <Controller
        name="parentId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            withAsterisk
            label="Parent Unit"
            value={value}
            error={errors?.typeId ? errors?.typeId?.message?.toString() : ''}
            name={'name'}
            onChange={onChange}
            data={
              parents?.map((unit: any) => ({
                value: unit?.id,
                label: unit?.name,
              })) || []
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

import {
  LoadingOverlay,
  NativeSelect,
  Stack,
  TextInput,
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
} from '../_api/spd.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Spd } from '@/models/spd/spd.model';
import { logger, notify } from '@megp/core-fe';

interface FormDetailProps {
  mode: 'new' | 'detail';
}

export function FormDetail({ mode }: FormDetailProps) {
  const spdSchema: ZodType<Partial<Spd>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().optional(),
    procurementCategory: z.enum([
      'goods',
      'consultancy',
      'non-consultancy',
      'works',
    ]),
    marketType: z.enum(['national', 'international']),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(spdSchema),
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
    logger.log('here');
    try {
      const result = await create({ ...data, isActive: true });
      if ('data' in result) {
        router.push(`/spd/${result.data.id}`);
      }
      notify('Success', 'Standard procurement document created successfully');
    } catch (err) {
      notify('Error', 'Error in creating spd');
    }
  };

  const onUpdate = async (data) => {
    try {
      logger.log(data);
      await update({ ...data, id: id?.toString() });
      notify('Success', 'Standard procurement document updated successfully');
    } catch {
      notify('Error', 'Error in updating spd');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'Standard procurement document  deleted successfully');
      router.push('/spds');
    } catch {
      notify('Error', 'Error in deleting spd');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        name: selected?.name,
        description: selected?.description,
        language: selected?.language,
        procurementCategory: selected?.procurementCategory,
        marketType: selected?.marketType,
        procurementTool: selected?.procurementTool,
        contractingMethod: selected?.contractingMethod,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
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
      <div className="flex space-x-4">
        <NativeSelect
          placeholder="Procurement Category"
          withAsterisk
          className="w-1/2"
          label="Procurement Category"
          data={['goods', 'consultancy', 'non-consultancy', 'works']}
          {...register('procurementCategory')}
        />
        <NativeSelect
          placeholder="Market Type"
          withAsterisk
          className="w-1/2"
          label="Market Type"
          data={['national', 'international']}
          {...register('marketType')}
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

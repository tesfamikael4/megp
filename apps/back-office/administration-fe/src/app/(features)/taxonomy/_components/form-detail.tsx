import { Stack, TextInput } from '@mantine/core';
import { EntityButton } from '@megp/entity';

import { useForm } from 'react-hook-form';
import { useUpdateMutation, useReadQuery } from '../_api/taxonomy.api';
import { useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { Taxonomy } from '@/models/taxonomy';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import DataImport from './data-import';
import { transformJSONData } from './utils/jsonFormatter';
import { useCreateTaxonomiesMutation } from '@/store/api/taxonomies/taxonomies.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
  refetch: () => void;
  close: () => void;
}

const defaultValues = {
  name: '',
  version: '',
  upload: '',
};

export function FormDetail({ mode, refetch, close }: FormDetailProps) {
  const taxonomySchema: ZodType<Partial<Taxonomy>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    version: z.string().min(1, { message: 'This field is required' }),
    upload: z.any().refine((val) => val.length > 0, 'File is required'),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    setValue,
  } = useForm<Taxonomy>({
    resolver: zodResolver(taxonomySchema),
    defaultValues,
  });

  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateTaxonomiesMutation();
  const [update, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateMutation();
  const { data: selected, isSuccess: selectedSuccess } = useReadQuery(
    id?.toString(),
  );

  const onCreate = async (data) => {
    const formattedData = transformJSONData(data.upload);

    try {
      await create({
        name: data.name,
        version: data.version,
        excelData: formattedData,
      });
      refetch();
      notifications.show({
        message: 'Taxonomy created successfully',
        title: 'Success',
      });
      close();
    } catch (err) {
      notifications.show({
        message: 'error in creating taxonomy',
        title: 'Error',
        color: 'red',
      });
    }
  };
  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        id: id?.toString(),
      });
      if (isUpdateSuccess)
        notifications.show({
          message: 'Taxonomy updated successfully',
          title: 'Success',
        });
    } catch {
      notifications.show({
        message: 'error in updating taxonomy',
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
        version: selected?.version,
        upload: selected?.upload,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack>
      <TextInput
        withAsterisk
        label="Name"
        error={errors?.name ? errors?.name?.message?.toString() : ''}
        required
        {...register('name')}
      />
      <TextInput
        withAsterisk
        label="Version"
        error={errors?.version ? errors?.version?.message?.toString() : ''}
        required
        {...register('version')}
      />
      <DataImport setValue={(data) => setValue('upload', data)} />

      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={onReset}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />
    </Stack>
  );
}

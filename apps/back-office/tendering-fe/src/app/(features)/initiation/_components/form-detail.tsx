import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Textarea, NativeSelect } from '@mantine/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { Tender } from '@/models/tender/tender.model';

export default function FormDetail() {
  const tenderSchema: ZodType<Partial<Tender>> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().optional(),
    language: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({ resolver: zodResolver(tenderSchema) });

  const onCreate = (data) => {
    logger.log(data);
    notify('Success', 'Tendering created successfully');
  };
  const onUpdate = (data) => {
    logger.log(data);
    notify('Success', 'Tendering created successfully');
  };
  const onDelete = (data) => {
    logger.log(data);
    notify('Success', 'Tendering created successfully');
  };

  return (
    <div>
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
          placeholder="Language"
          withAsterisk
          className="w-1/2"
          label="Language"
          data={['English', 'Amharic']}
          {...register('language')}
        />
      </div>
      <EntityButton
        mode={'new'}
        data={{}}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onDelete={handleSubmit(onDelete)}
        isSaving={false}
        isUpdating={false}
        isDeleting={false}
      />
    </div>
  );
}

import {
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  useReadQuery,
  useDeleteMutation,
  useUpdateMutation,
  useCreateMutation,
} from '../../_api/rfx/qualification.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { Qualification } from '@/models/tender/qualification.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  close: () => void;
}

const schema = z.object({
  criteria: z.string(),
});

type qualificationSchema = z.infer<typeof schema>;

export function QualificationFormDetail({ mode, close }: FormDetailProps) {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<qualificationSchema>({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        order: 1,
        rfxId: id.toString(),
      });
      notify('Success', 'Qualification created successfully');
      close();
    } catch (err) {
      notify('Error', 'Error in creating qualification');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        rfxId: id,
        order: 1,
      });
      notify('Success', 'Qualification updated successfully');
      close();
    } catch {
      notify('Error', 'Error in updating qualification');
    }
  };

  return (
    <Stack pos="relative">
      {/* <LoadingOverlay visible={isLoading} /> */}
      <TextInput
        label="Criteria"
        placeholder="Criteria"
        withAsterisk
        {...register('criteria')}
      />
      <EntityButton
        mode={mode}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />
    </Stack>
  );
}

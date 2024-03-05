import {
  Checkbox,
  LoadingOverlay,
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
} from '../_api/administrative-compliance.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { SpdPreliminaryExamination } from '@/models/spd/preliminary-examination.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
  type: 'technical' | 'financial';
}

export function SpdAdministrativeComplianceFormDetail({
  mode,
  adId,
  type,
}: FormDetailProps) {
  const spdSchema: ZodType<Partial<SpdPreliminaryExamination>> = z.object({
    criteria: z.string().min(1, { message: 'This field is required' }),
    type: z.enum(['technical', 'financial']).optional(),
    itbDescription: z.string().min(1, { message: 'This field is required' }),
    itbReference: z.string().min(1, { message: 'This field is required' }),
    formLink: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(spdSchema),
  });
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(adId?.toString());

  const onCreate = async (data) => {
    logger.log('here');
    try {
      await create({
        ...data,
        spdId: id,
        type: type,
        value: '',
        mandate: '',
        order: 1,
      });
      notify('Success', 'Preliminary examination created successfully');
    } catch (err) {
      notify('Error', 'Error in creating preliminary examination');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, pdId: id, type: type, id: adId?.toString() });
      notify('Success', 'Preliminary examination updated successfully');
    } catch {
      notify('Error', 'Error in updating preliminary examination');
    }
  };
  const onDelete = async () => {
    try {
      await remove(adId?.toString());
      notify('Success', 'Preliminary examination deleted successfully');
    } catch {
      notify('Error', 'Error in deleting preliminary examination');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        criteria: selected?.criteria,
        type: selected?.type,
        itbReference: selected?.itbReference,
        formLink: selected?.formLink,
        itbDescription: selected?.itbDescription,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Textarea
        label="Criteria"
        withAsterisk
        autosize
        minRows={2}
        error={errors?.criteria ? errors?.criteria?.message?.toString() : ''}
        {...register('criteria')}
      />

      <TextInput
        label="ITB Reference"
        withAsterisk
        error={
          errors?.itbReference ? errors?.itbReference?.message?.toString() : ''
        }
        {...register('itbReference')}
      />

      <Textarea
        label="ITB Description"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.itbDescription
            ? errors?.itbDescription?.message?.toString()
            : ''
        }
        {...register('itbDescription')}
      />

      <TextInput
        placeholder="Bid Form Link"
        withAsterisk
        label="formLink"
        error={errors?.formLink ? errors?.formLink?.message?.toString() : ''}
        {...register('formLink')}
      />

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

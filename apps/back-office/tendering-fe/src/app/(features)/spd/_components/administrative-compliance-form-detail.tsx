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
import { useRouter } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { SpdAdministrativeCompliance } from '@/models/spd/administrative-compliance.model';

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
  const spdSchema: ZodType<Partial<SpdAdministrativeCompliance>> = z.object({
    criteria: z.string().min(1, { message: 'This field is required' }),
    attribute: z.string().min(1, { message: 'This field is required' }),
    value: z.string().optional(),
    type: z.string().optional(),
    reference: z.string().min(1, { message: 'This field is required' }),
    formLink: z.string().min(1, { message: 'This field is required' }),
    isRequired: z.boolean(),
    itbDescription: z.string().min(1, { message: 'This field is required' }),
    mandate: z.string().optional(),
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
        attribute: selected?.attribute,
        value: selected?.value,
        type: selected?.type,
        reference: selected?.reference,
        formLink: selected?.formLink,
        isRequired: selected?.isRequired,
        itbDescription: selected?.itbDescription,
        mandate: selected?.mandate,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Checkbox
        label="Cannot be modified by procuring entity"
        {...register('isRequired')}
      />
      <Textarea
        label="Criteria"
        withAsterisk
        autosize
        minRows={2}
        error={errors?.criteria ? errors?.criteria?.message?.toString() : ''}
        {...register('criteria')}
      />
      <TextInput
        label="Data Field from ITB"
        withAsterisk
        error={errors?.attribute ? errors?.attribute?.message?.toString() : ''}
        {...register('attribute')}
      />

      <TextInput
        label="ITB Reference"
        withAsterisk
        error={errors?.reference ? errors?.reference?.message?.toString() : ''}
        {...register('reference')}
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

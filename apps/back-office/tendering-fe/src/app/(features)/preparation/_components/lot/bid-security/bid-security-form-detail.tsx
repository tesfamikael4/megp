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
} from '@/app/(features)/preparation/_api/lot/bid-security.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { BidSecurity } from '@/models/tender/lot/bid-security.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
  type: 'technical' | 'financial';
}

export function BidSecurityFormDetail({
  mode,
  adId,
  type,
}: Readonly<FormDetailProps>) {
  const bidSecuritySchema: ZodType<Partial<BidSecurity>> = z.object({
    bidSecurityRequired: z.boolean(),
    criteria: z.string().min(1, { message: 'This field is required' }),
    bidSecurityAmount: z.number({ required_error: 'This field is required' }),
    bidSecurityCurrency: z
      .string()
      .min(1, { message: 'This field is required' }),
    bidSecurityForm: z.enum([
      'declaration',
      'spo',
      'insurance letter',
      'Letter from small and micro enterprise',
    ]),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(bidSecuritySchema),
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
        bidSecurityId: id,
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

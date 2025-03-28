import {
  LoadingOverlay,
  Select,
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
} from '../_api/qualification.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { SpdQualification } from '@/models/spd/qualification.model';
import { useLazyListByIdQuery } from '../_api/bid-form.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
  type: 'legal' | 'professional' | 'technical' | 'financial' | 'performance';
  returnFunction: () => void;
}

export function SpdQualificationFormDetail({
  mode,
  adId,
  type,
  returnFunction,
}: FormDetailProps) {
  const spdSchema: ZodType<Partial<SpdQualification>> = z.object({
    category: z.string().optional(),
    factor: z.string().min(1, { message: 'This field is required' }),
    requirement: z.string().optional(),
    bidFormId: z.string().min(1, { message: 'This field is required' }),
    itbDescription: z.string().min(1, { message: 'This field is required' }),
    itbReference: z.string().min(1, { message: 'This field is required' }),
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(spdSchema),
  });
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  const router = useRouter();
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(adId?.toString());

  const [trigger, { data: bidFormLinks, isLoading: isBidFormLoading }] =
    useLazyListByIdQuery();

  const onCreate = async (data) => {
    logger.log('here');
    try {
      await create({
        ...data,
        spdId: id,
        category: type,
      });
      returnFunction();
      notify('Success', 'Qualification created successfully');
    } catch (err) {
      notify('Error', 'Error in creating spd');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        category: type,
        id: adId?.toString(),
      });
      returnFunction();
      notify('Success', 'Qualification updated successfully');
    } catch {
      notify('Error', 'Error in updating spd');
    }
  };
  const onDelete = async () => {
    try {
      await remove(adId?.toString());
      notify('Success', 'Qualification  deleted successfully');
      router.push('/spds');
    } catch {
      notify('Error', 'Error in deleting spd');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        category: selected?.category,
        factor: selected?.factor,
        requirement: selected?.requirement,
        bidFormId: selected?.bidFormId,
        isRequired: selected?.isRequired,
        itbDescription: selected?.itbDescription,
        itbReference: selected?.itbReference,
        mandate: selected?.itbDescription,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  useEffect(() => {
    if (id) {
      trigger({
        id: id.toString(),
        collectionQuery: { where: [] },
      });
    }
  }, [id, trigger]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isBidFormLoading} />
      <TextInput
        label="Factor"
        withAsterisk
        error={errors?.factor ? errors?.factor?.message?.toString() : ''}
        {...register('factor')}
      />

      <Textarea
        label="Criterion / Requirement"
        withAsterisk
        autosize
        minRows={2}
        error={
          errors?.requirement ? errors?.requirement?.message?.toString() : ''
        }
        {...register('requirement')}
      />

      <TextInput
        label="ITB Reference"
        withAsterisk
        error={errors?.reference ? errors?.reference?.message?.toString() : ''}
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

      <Controller
        control={control}
        name="bidFormId"
        render={({ field: { value, name, onChange } }) => (
          <Select
            data={
              bidFormLinks?.items
                ? bidFormLinks?.items.map((link) => ({
                    label: link.title,
                    value: link.id,
                  }))
                : []
            }
            error={
              errors?.bidFormId ? errors?.bidFormId?.message?.toString() : ''
            }
            label="Form Link"
            withAsterisk
            name={name}
            className="w-1/2"
            nothingFoundMessage="No options"
            onChange={onChange}
            placeholder="Bid Form Link"
            searchable
            value={value}
          />
        )}
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

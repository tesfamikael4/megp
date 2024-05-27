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
} from '../_api/administrative-compliance.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { SpdPreliminaryExamination } from '@/models/spd/preliminary-examination.model';
import { useLazyListByIdQuery } from '../_api/bid-form.api';

interface FormDetailProps {
  mode: 'new' | 'detail';
  adId: string;
  type: 'technical' | 'financial';
  returnFunction: () => void;
}

export function SpdAdministrativeComplianceFormDetail({
  mode,
  adId,
  type,
  returnFunction,
}: FormDetailProps) {
  const { id } = useParams();
  const spdSchema: ZodType<Partial<SpdPreliminaryExamination>> = z.object({
    criteria: z.string().min(1, { message: 'This field is required' }),
    type: z.enum(['technical', 'financial']).optional(),
    itbDescription: z.string().min(1, { message: 'This field is required' }),
    itbReference: z.string().min(1, { message: 'This field is required' }),
    bidFromId: z.string().min(1, { message: 'This field is required' }),
  });
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
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
      returnFunction();
      notify('Success', 'Preliminary examination created successfully');
    } catch (err) {
      notify('Error', 'Error in creating preliminary examination');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, type: type, id: adId?.toString() });
      returnFunction();
      notify('Success', 'Preliminary examination updated successfully');
    } catch {
      notify('Error', 'Error in updating preliminary examination');
    }
  };
  const onDelete = async () => {
    try {
      await remove(adId?.toString());
      returnFunction();
      notify('Success', 'Preliminary examination deleted successfully');
    } catch {
      notify('Error', 'Error in deleting preliminary examination');
    }
  };

  useEffect(() => {
    if (id?.toString())
      trigger({
        id: id?.toString(),
        collectionQuery: { where: [] },
      });
  }, [id, trigger]);

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        criteria: selected?.criteria,
        type: selected?.type,
        itbReference: selected?.itbReference,
        bidFromId: selected?.bidFromId,
        itbDescription: selected?.itbDescription,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isFetching} />
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
      <NativeSelect
        placeholder="Form Link"
        withAsterisk
        label="Bid Form Link"
        error={errors?.bidFromId ? errors?.bidFromId?.message?.toString() : ''}
        data={
          data?.items
            ? data?.items.map((link) => ({
                label: link.title,
                value: link.id,
              }))
            : []
        }
        {...register('bidFromId')}
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

import {
  LoadingOverlay,
  NativeSelect,
  Stack,
  TextInput,
  Checkbox,
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
} from '../_api/documentary-evidence.api';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import {
  EvidenceType,
  RequiredTo,
  SpdDocumentaryEvidence,
} from '@/models/spd/documentary-evidence.model';

interface FormDetailProps {
  mode: 'new' | 'detail';
  deId: string;
}

export function SpdDocumentaryEvidenceFormDetail({
  mode,
  deId,
}: FormDetailProps) {
  const spdSchema: ZodType<Partial<SpdDocumentaryEvidence>> = z.object({
    evidenceTitle: z.string().min(1, { message: 'This field is required' }),
    sectionLink: z.string().optional(),
    evidenceType: z.string().min(1, { message: 'This field is required' }),
    checkOnFirstOpening: z.boolean(),
    checkOnFirstCompliance: z.boolean(),
    checkOnSecondOpening: z.boolean(),
    checkOnSecondCompliance: z.boolean(),
    requiredTo: z.string().min(1, { message: 'This field is required' }),
    isRequired: z.boolean(),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(spdSchema),
  });
  const { id } = useParams();

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = useDeleteMutation();

  const {
    data: selected,
    isSuccess: selectedSuccess,
    isLoading,
  } = useReadQuery(deId?.toString());
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  const onCreate = async (data) => {
    logger.log('here');
    try {
      await create({ ...data, spdId: id?.toString() });
      notify('Success', 'Documentary evidence created successfully');
    } catch (err) {
      notify('Error', 'Error in creating documentary evidence');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({ ...data, spdId: id?.toString(), id: deId?.toString() });
      notify('Success', 'Documentary evidence updated successfully');
    } catch {
      notify('Error', 'Error in updating documentary evidence');
    }
  };
  const onDelete = async () => {
    try {
      await remove(id?.toString());
      notify('Success', 'Documentary evidence deleted successfully');
    } catch {
      notify('Error', 'Error in deleting documentary evidence');
    }
  };

  useEffect(() => {
    if (mode == 'detail' && selectedSuccess && selected !== undefined) {
      reset({
        evidenceTitle: selected?.evidenceTitle,
        sectionLink: selected?.sectionLink,
        evidenceType: selected?.evidenceType,
        checkOnFirstOpening: selected?.checkOnFirstOpening,
        checkOnFirstCompliance: selected?.checkOnFirstCompliance,
        checkOnSecondOpening: selected?.checkOnSecondOpening,
        checkOnSecondCompliance: selected?.checkOnSecondCompliance,
        requiredTo: selected?.requiredTo,
        isRequired: selected?.isRequired,
      });
    }
  }, [mode, reset, selected, selectedSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Checkbox
        className="w-1/2"
        label="is Required"
        {...register('isRequired')}
      />
      <div className="flex space-x-4">
        <NativeSelect
          placeholder="Evidence type"
          withAsterisk
          className="w-1/2"
          label="Evidence type"
          error={
            errors?.evidenceType
              ? errors?.evidenceType?.message?.toString()
              : ''
          }
          data={Object.values(EvidenceType)}
          {...register('evidenceType')}
        />
        <NativeSelect
          placeholder="Required to"
          withAsterisk
          className="w-1/2"
          label="Required to"
          error={
            errors?.requiredTo ? errors?.requiredTo?.message?.toString() : ''
          }
          data={Object.values(RequiredTo)}
          {...register('requiredTo')}
        />
      </div>
      <TextInput
        label="Evidence Title"
        withAsterisk
        error={
          errors?.evidenceTitle
            ? errors?.evidenceTitle?.message?.toString()
            : ''
        }
        {...register('evidenceTitle')}
      />
      <TextInput
        label="Bid Form Link"
        withAsterisk
        error={
          errors?.sectionLink ? errors?.sectionLink?.message?.toString() : ''
        }
        {...register('sectionLink')}
      />
      <div className="flex space-x-4">
        <Checkbox
          className="w-1/2"
          label="Check on first opening"
          {...register('checkOnFirstOpening')}
        />

        <Checkbox
          className="w-1/2"
          label="Check on first compliance"
          {...register('checkOnFirstCompliance')}
        />
      </div>
      <div className="flex space-x-4">
        <Checkbox
          className="w-1/2"
          label="Check on second opening"
          {...register('checkOnSecondOpening')}
        />

        <Checkbox
          className="w-1/2"
          label="Check on second compliance"
          {...register('checkOnSecondCompliance')}
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

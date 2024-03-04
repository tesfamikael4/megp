import { ITenderSubmission } from '@/models/tender/bid-procedures/submission.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingOverlay, NativeSelect, Stack } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '@/app/(features)/preparation/_api/tender/bid-submissions.api';
import { logger, notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { DateInput } from '@mantine/dates';

export default function SubmissionDetail() {
  const { id } = useParams();
  const SubmissionSchema: ZodType<Partial<ITenderSubmission>> = z
    .object({
      submissionDeadline: z
        .date()
        .min(new Date(), { message: 'This field is required' }),
      openingDate: z
        .date()
        .min(new Date(), { message: 'This field is required' }),
      invitationDate: z
        .date()
        .min(new Date(), { message: 'This field is required' }),
      envelopType: z.enum(['single envelop', 'two envelops']),
    })
    .refine(
      (data) => data.openingDate.getTime() > data.submissionDeadline.getTime(),
      {
        message: 'opening date must be after submission deadline',
        path: ['openingDate'], // Pointing out which field is invalid
      },
    )
    .refine(
      (data) =>
        data.invitationDate.getTime() < data.submissionDeadline.getTime(),
      {
        message: 'invitation date must not pass the opening date',
        path: ['invitationDate'], // Pointing out which field is invalid
      },
    );

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(SubmissionSchema),
  });

  const { data: selected, isSuccess, isLoading } = useReadQuery(id?.toString());
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
  useEffect(() => {
    logger.log(errors);
  }, [errors]);
  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
      });
      notify('Success', 'Bid Submission created successfully');
    } catch (err) {
      notify('Error', 'Error in creating bid submission');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: id?.toString(),
      });
      notify('Success', 'Bid Submission updated successfully');
    } catch {
      notify('Error', 'Error in updating bid submission');
    }
  };

  useEffect(() => {
    if (isSuccess && selected) {
      reset({
        submissionDeadline: new Date(selected?.submissionDeadline),
        openingDate: new Date(selected?.openingDate),
        invitationDate: new Date(selected?.invitationDate),
        envelopType: selected?.envelopType,
      });
    }
  }, [reset, selected, isSuccess]);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />

      <div className="flex gap-3">
        <NativeSelect
          placeholder="Envelope Type"
          withAsterisk
          label="Envelope Type"
          className="w-1/2"
          data={['single envelop', 'two envelops']}
          error={
            errors['envelopType']
              ? errors['envelopType']?.message?.toString()
              : ''
          }
          {...register('envelopType')}
        />
        <Controller
          name="invitationDate"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <DateInput
              name={name}
              value={value}
              withAsterisk
              className="w-1/2"
              onChange={onChange}
              label="Invitation Date"
              error={
                errors['invitationDate']
                  ? errors['invitationDate']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </div>

      <div className="flex gap-3">
        <Controller
          name="submissionDeadline"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <DateInput
              name={name}
              value={value}
              withAsterisk
              className="w-1/2"
              onChange={onChange}
              label="Submission Deadline"
              error={
                errors['submissionDeadline']
                  ? errors['submissionDeadline']?.message?.toString()
                  : ''
              }
            />
          )}
        />

        <Controller
          name="openingDate"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <DateInput
              name={name}
              value={value}
              withAsterisk
              className="w-1/2"
              onChange={onChange}
              label="Opening Date"
              error={
                errors['openingDate']
                  ? errors['openingDate']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </div>

      <EntityButton
        mode={selected ? 'detail' : 'new'}
        data={selected}
        onCreate={handleSubmit(onCreate)}
        onUpdate={handleSubmit(onUpdate)}
        onReset={reset}
        isSaving={isSaving}
        isUpdating={isUpdating}
      />
    </Stack>
  );
}

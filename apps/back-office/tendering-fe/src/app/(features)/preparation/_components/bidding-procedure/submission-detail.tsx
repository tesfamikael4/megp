import { ITenderSubmission } from '@/models/tender/bid-procedures/submission.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingOverlay, NativeSelect, Stack } from '@mantine/core';
import { EntityButton } from '@megp/entity';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ZodType, z } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '@/app/(features)/preparation/_api/tender/bid-submissions.api';
import { notify } from '@megp/core-fe';
import { useParams } from 'next/navigation';
import { DateTimePicker } from '@mantine/dates';

export default function SubmissionDetail({
  fromExtension,
}: {
  fromExtension: boolean | null;
}) {
  const { id } = useParams();
  const SubmissionSchema: ZodType<Partial<ITenderSubmission>> = z
    .object({
      invitationDate: z
        .date()
        .min(new Date(), { message: 'This field is required' }),
      submissionDeadline: z
        .date()
        .min(new Date(), { message: 'This field is required' }),
      openingDate: z
        .date()
        .min(new Date(), { message: 'This field is required' }),
      envelopType: z.enum(['single envelop', 'two envelop']),
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
    watch,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(SubmissionSchema),
  });
  const inviteDate = watch('invitationDate');
  const dateOfSubission = watch('submissionDeadline');
  const [initalDate, setInitalDate] = useState<Date | null>(null);
  const [submitDate, setSubmitDate] = useState<Date | null>(null);
  const { data: selected, isSuccess, isLoading } = useReadQuery(id?.toString());
  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();
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

  useEffect(() => {
    if (inviteDate) {
      setInitalDate(inviteDate);
    }
  }, [inviteDate]);

  useEffect(() => {
    if (dateOfSubission) {
      setSubmitDate(dateOfSubission);
    }
  }, [dateOfSubission]);
  return (
    <Stack pos="relative">
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />

      <div className="flex gap-3">
        {!fromExtension && (
          <NativeSelect
            placeholder="Envelope Type"
            withAsterisk
            label="Envelope Type"
            className="w-1/2"
            data={['single envelop', 'two envelop']}
            error={
              errors['envelopType']
                ? errors['envelopType']?.message?.toString()
                : ''
            }
            {...register('envelopType')}
          />
        )}
        <Controller
          name="invitationDate"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <DateTimePicker
              name={name}
              value={value}
              minDate={fromExtension ? undefined : new Date()}
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
        {initalDate ? (
          <Controller
            name="submissionDeadline"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <DateTimePicker
                name={name}
                value={value}
                minDate={initalDate}
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
        ) : (
          <Controller
            name="submissionDeadline"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <DateTimePicker
                name={name}
                placeholder="Please Select Invitation Date First"
                value={value}
                disabled={true}
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
        )}
        {submitDate ? (
          <Controller
            name="openingDate"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <DateTimePicker
                name={name}
                value={value}
                withAsterisk
                minDate={submitDate}
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
        ) : (
          <Controller
            name="openingDate"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <DateTimePicker
                name={name}
                placeholder="Please Select Submision Date First"
                value={value}
                withAsterisk
                disabled={true}
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
        )}
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

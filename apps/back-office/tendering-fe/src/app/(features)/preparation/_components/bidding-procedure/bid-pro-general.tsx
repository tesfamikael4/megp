import { ITenderGeneral } from '@/models/tender/bid-procedures/general.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  Flex,
  LoadingOverlay,
  NumberInput,
  Stack,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '@/app/(features)/preparation/_api/tender/bid-pro-general.api';
import { useParams } from 'next/navigation';
import { notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { DateInput } from '@mantine/dates';

export default function BidProGeneral() {
  const { id } = useParams();
  const generalSchema: ZodType<Partial<ITenderGeneral>> = z
    .object({
      jointVentureAllowed: z.boolean({
        required_error: 'Joint Venture Allowed is required',
      }),
      maximumNumberOfMembers: z
        .number()
        .min(1, { message: 'This field is required' }),
      subContractAllowed: z.boolean({
        required_error: 'Sub-Contract Allowed is required',
      }),
      maximumPercentageContractingAllowed: z.boolean({
        required_error: 'Maximum Percentage Contracting Allowed is required',
      }),
      clarificationDeadline: z.date(),
      preBidConferenceRequired: z.boolean(),
      preBidConferenceDate: z.date(),
      siteVisitAllowed: z.boolean(),
    })
    .refine((data) => data.preBidConferenceRequired, {
      message: 'prebid conference date is required',
      path: ['preBidConferenceDate'],
    });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(generalSchema),
  });

  const { data: selected, isSuccess, isLoading } = useReadQuery(id?.toString());

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    try {
      await create({
        ...data,
        tenderId: id,
        spdId: id,
      });
      notify('Success', 'Bid Procurement General created successfully');
    } catch (err) {
      notify('Error', 'Error in creating bid procurement general');
    }
  };

  const onUpdate = async (data) => {
    try {
      await update({
        ...data,
        tenderId: id,
        id: selected.id?.toString(),
      });
      notify('Success', 'Bid Procurement General updated successfully');
    } catch {
      notify('Error', 'Error in updating bid procurement general');
    }
  };

  useEffect(() => {
    if (isSuccess && selected) {
      reset({
        jointVentureAllowed: selected.jointVentureAllowed,
        maximumNumberOfMembers: selected.maximumNumberOfMembers,
        subContractAllowed: selected.subContractAllowed,
        clarificationDeadline: new Date(selected.clarificationDeadline),
        preBidConferenceRequired: selected.preBidConferenceRequired,
        preBidConferenceDate: new Date(selected.preBidConferenceDate),
        siteVisitAllowed: selected.siteVisitAllowed,
      });
    }
  }, [reset, selected, isSuccess]);

  return (
    <Stack pos="relative" pb={'sm'}>
      <LoadingOverlay visible={isLoading || isUpdating || isSaving} />
      <Flex gap="md">
        <Checkbox
          label="Joint Venture Allowed"
          className="w-1/2"
          {...register('jointVentureAllowed')}
        />
        <Checkbox
          label="Site Visit Allowed"
          className="w-1/2"
          {...register('siteVisitAllowed')}
        />
      </Flex>
      <div className="flex gap-3 items-center">
        <Controller
          name="maximumNumberOfMembers"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Maximum Number of Members"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['maximumNumberOfMembers']
                  ? errors['maximumNumberOfMembers']?.message?.toString()
                  : ''
              }
              withAsterisk
            />
          )}
        />
        <Controller
          name="clarificationDeadline"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <DateInput
              name={name}
              value={value}
              className="w-1/2"
              onChange={onChange}
              label="Clarification Deadline"
              error={
                errors['clarificationDeadline']
                  ? errors['clarificationDeadline']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </div>
      <div className="flex gap-3 items-center">
        <Checkbox
          label="Pre Bid Conference Required"
          className="w-1/2"
          {...register('preBidConferenceRequired')}
        />
        <Controller
          name="preBidConferenceDate"
          control={control}
          render={({ field: { name, onChange, value } }) => (
            <DateInput
              name={name}
              value={value}
              className="w-1/2"
              onChange={onChange}
              label="Pre Bid Conference Date"
              error={
                errors['preBidConferenceDate']
                  ? errors['preBidConferenceDate']?.message?.toString()
                  : ''
              }
            />
          )}
        />
      </div>
      <div className="flex gap-3 items-center">
        <Checkbox
          label="Sub-Contract Allowed"
          className="w-1/2"
          {...register('subContractAllowed')}
        />
        <Controller
          name="maximumPercentageContractingAllowed"
          control={control}
          render={({ field: { name, value, onChange } }) => (
            <NumberInput
              label="Maximum Percentage Sub-contacting Allowed"
              name={name}
              value={value}
              className="w-1/2"
              onChange={(d) => onChange(parseInt(d as string))}
              error={
                errors['maximumPercentageContractingAllowed']
                  ? errors[
                      'maximumPercentageContractingAllowed'
                    ]?.message?.toString()
                  : ''
              }
              withAsterisk
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

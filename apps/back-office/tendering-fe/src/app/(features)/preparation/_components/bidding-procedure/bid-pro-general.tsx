import { ITenderGeneral } from '@/models/tender/bid-procedures/general.model';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  Flex,
  LoadingOverlay,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import {
  useCreateMutation,
  useReadQuery,
  useUpdateMutation,
} from '@/app/(features)/preparation/_api/tender/bid-pro-general.api';
import { useParams } from 'next/navigation';
import { logger, notify } from '@megp/core-fe';
import { EntityButton } from '@megp/entity';
import { DateInput } from '@mantine/dates';

export default function BidProGeneral() {
  const { id } = useParams();

  const [isSubContractRequired, setISubContractequired] =
    useState<boolean>(false);
  const [isPreBidDateError, setIsPreBidDateError] = useState<boolean>(false);
  const generalSchema: ZodType<Partial<ITenderGeneral>> = z.object({
    jointVentureAllowed: z.boolean({
      required_error: 'Joint Venture Allowed is required',
    }),
    maximumNumberOfMembers: z
      .number()
      .nonnegative()
      .min(1, { message: 'This field is required' }),
    subContractAllowed: z.boolean({
      required_error: 'Sub-Contract Allowed is required',
    }),
    maximumPercentageContractingAllowed: z
      .number()
      .nonnegative()
      .lte(100)
      .optional(),
    clarificationDeadline: z.date(),
    preBidConferenceRequired: z.boolean(),
    preBidConferenceDate: z.date().optional(),
    siteVisitAllowed: z.boolean(),
  });
  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    register,
    control,
  } = useForm({
    resolver: zodResolver(generalSchema),
  });

  const preBidDateRequired = watch('preBidConferenceRequired');
  const preBidDate = watch('preBidConferenceDate');
  const subContract = watch('subContractAllowed');
  const maxPercentageAllowed = watch('maximumPercentageContractingAllowed');

  const { data: selected, isSuccess, isLoading } = useReadQuery(id?.toString());

  const [create, { isLoading: isSaving }] = useCreateMutation();
  const [update, { isLoading: isUpdating }] = useUpdateMutation();

  const onCreate = async (data) => {
    if (
      (preBidDateRequired && !preBidDate) ||
      (subContract && !maxPercentageAllowed)
    ) {
      setIsPreBidDateError(preBidDateRequired && !preBidDate);
      setISubContractequired(subContract && !maxPercentageAllowed);
      return;
    } else {
      setIsPreBidDateError(false);
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
    }
  };

  const onUpdate = async (data) => {
    if (preBidDateRequired && !preBidDate) {
      setIsPreBidDateError(true);
      return;
    } else {
      setIsPreBidDateError(false);
      try {
        await update({
          ...data,
          tenderId: id,
          id: id?.toString(),
        });
        notify('Success', 'Bid Procurement General updated successfully');
      } catch {
        notify('Error', 'Error in updating bid procurement general');
      }
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
        maximumPercentageContractingAllowed: Number(
          selected.maximumPercentageContractingAllowed,
        ),
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
      <Flex gap={'md'} className="flex gap-3 items-center">
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
      </Flex>
      <div className="flex gap-3 items-center">
        <Checkbox
          label="Pre Bid Conference Required"
          className="w-1/2"
          {...register('preBidConferenceRequired')}
        />
        <Checkbox
          label="Sub-Contract Allowed"
          className="w-1/2"
          {...register('subContractAllowed')}
        />
      </div>
      <Flex gap={'md'} className="w-full" align={'start'}>
        {preBidDateRequired && (
          <Flex className="w-1/2" direction={'column'} gap={'sm'}>
            <Controller
              name="preBidConferenceDate"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <DateInput
                  name={name}
                  value={value}
                  className="w-full"
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
            {isPreBidDateError && (
              <Text className="text-red-500" size="sm">
                Pre bid conference date is required
              </Text>
            )}
          </Flex>
        )}
        {subContract && (
          <Flex direction={'column'} gap={'sm'} className="w-1/2">
            <Controller
              name="maximumPercentageContractingAllowed"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <NumberInput
                  label="Maximum Percentage Sub-contacting Allowed"
                  name={name}
                  value={value}
                  className="w-full"
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

            {isSubContractRequired && (
              <Text className="text-red-500" size="sm">
                Maximum percentage sub contractig allowed is required
              </Text>
            )}
          </Flex>
        )}
      </Flex>

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

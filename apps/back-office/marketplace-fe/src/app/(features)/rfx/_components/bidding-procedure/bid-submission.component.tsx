'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Flex,
  LoadingOverlay,
  NumberInput,
  Stack,
  Switch,
} from '@mantine/core';
import { logger } from '@megp/core-fe';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { z } from 'zod';
import { DateTimePicker } from '@mantine/dates';
import { IconDeviceFloppy, IconPercentage } from '@tabler/icons-react';
import {
  useCreateMutation,
  useLazyListByIdQuery,
  useUpdateMutation,
} from '../../_api/rfx/bidding-procedure.api';
import { useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';

const schema = z.object({
  bidValidityPeriod: z.number(),
  submissionDeadline: z.string(),
  openingDate: z.string(),
  deltaPercentage: z.number(),
  idleTime: z.number().optional().default(0),
  isReverseAuction: z.boolean().default(false),
  round: z.number().optional().default(1),
  minimumBidDecrementPercentage: z.number().optional().default(0),
  roundDuration: z.number().optional().default(0),
});
// .refine(
//   (data) =>
//     data.isReverseAuction &&
//     (!data.round ||
//       !data.minimumBidDecrementPercentage ||
//       !data.roundDuration ||
//       !data.idleTime),
//   {
//     message: 'This field is required',
//     path: ['isReverseAuction'],
//   },
// );

type FormSchema = z.infer<typeof schema>;

export function parseDate(date: Date | null) {
  const parsedDate = new Date(
    (date?.getTime() ?? 0) - (date?.getTimezoneOffset() ?? 0) * 60 * 1000,
  )
    .toISOString()
    .split('T')[0];
  return parsedDate;
}

export default function BidSubmission() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });
  const { id } = useParams();

  const [
    getBidProcedure,
    { data: biddingProcedure, isLoading: isGettingProcedure },
  ] = useLazyListByIdQuery();
  const [createProcedure, { isLoading: isCreating }] = useCreateMutation();
  const [updateProcedure, { isLoading: isUpdating }] = useUpdateMutation();

  const onSubmit = async (data: FormSchema) => {
    try {
      if (biddingProcedure && biddingProcedure?.items?.length > 0) {
        await updateProcedure({
          ...data,
          id: biddingProcedure?.items?.[0]?.id,
          rfxId: id,
        }).unwrap();
      } else {
        await createProcedure({ ...data, rfxId: id }).unwrap();
      }
      notifications.show({
        title: 'Success',
        message: 'Bidding procedure saved successfully',
        color: 'green',
      });
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err?.data?.message,
        color: 'red',
      });
    }
  };

  const onError = (err: any) => {
    logger.log(err);
  };

  useEffect(() => {
    getBidProcedure({ id: id.toString(), collectionQuery: {} });
  }, []);

  useEffect(() => {
    reset(biddingProcedure?.items?.[0] ?? {});
  }, [biddingProcedure]);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Stack className="w-full">
        <LoadingOverlay visible={isGettingProcedure} />
        <Flex className="gap-4">
          <Controller
            name="submissionDeadline"
            control={control}
            render={({ field: { name, value } }) => (
              <DateTimePicker
                name={name}
                withAsterisk
                label="Submission Deadline"
                placeholder="Submission Deadline"
                value={value ? new Date(value) : null}
                minDate={new Date()}
                className="w-full"
                onChange={(value) => {
                  setValue(
                    'submissionDeadline',
                    value?.toISOString() ?? new Date().toISOString(),
                  );
                }}
                error={errors?.submissionDeadline?.message}
              />
            )}
          />
          <Controller
            name="openingDate"
            control={control}
            render={({ field: { name, value } }) => {
              const submissionDeadline = watch('submissionDeadline');
              const minDate =
                submissionDeadline &&
                !isNaN(new Date(submissionDeadline).getTime())
                  ? new Date(
                      new Date(submissionDeadline).getTime() + 5 * 60 * 1000,
                    )
                  : new Date(Date.now() + 24 * 60 * 60 * 1000);

              return (
                <DateTimePicker
                  name={name}
                  withAsterisk
                  label="Opening Date"
                  placeholder="Opening Date"
                  value={value ? new Date(value) : null}
                  minDate={minDate}
                  className="w-full"
                  onChange={(value) => {
                    setValue(
                      'openingDate',
                      value?.toISOString() ?? new Date().toISOString(),
                    );
                  }}
                  error={errors?.openingDate?.message}
                />
              );
            }}
          />
        </Flex>
        <Flex className="gap-4">
          <Controller
            name="bidValidityPeriod"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                name={name}
                label="Bid Validity Period (in days)"
                placeholder="Bid Validity Period (in days)"
                value={value}
                className="w-[calc(50%-0.5rem)]"
                onChange={onChange}
                error={errors?.bidValidityPeriod?.message}
                allowNegative={false}
                suffix=" days"
                withAsterisk
              />
            )}
          />
          <Controller
            name="deltaPercentage"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <NumberInput
                name={name}
                label="Percentage Quantity Change (in %)"
                placeholder="Percentage Quantity Change (in %)"
                leftSection={<IconPercentage />}
                value={value}
                className="w-[calc(50%-0.5rem)]"
                suffix=" %"
                onChange={onChange}
                min={0}
                max={100}
                error={errors?.deltaPercentage?.message}
                withAsterisk
              />
            )}
          />
        </Flex>
        <Flex>
          <Stack className="w-full">
            <Controller
              name="isReverseAuction"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <Switch
                  name={name}
                  label="Is Reverse Auction"
                  checked={value}
                  onChange={(event) =>
                    setValue('isReverseAuction', event.currentTarget.checked)
                  }
                />
              )}
            />
            {watch('isReverseAuction') && (
              <Stack>
                <Flex className="gap-2">
                  <Controller
                    name="round"
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <NumberInput
                        name={name}
                        label="Round"
                        placeholder="Round"
                        value={value}
                        className="w-[calc(50%-0.5rem)]"
                        onChange={onChange}
                        error={errors?.round?.message}
                        allowNegative={false}
                        withAsterisk
                      />
                    )}
                  />
                  <Controller
                    name="roundDuration"
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <NumberInput
                        name={name}
                        label="Round Duration (in mins)"
                        placeholder="Round Duration (in mins)"
                        value={value}
                        className="w-[calc(50%-0.5rem)]"
                        onChange={onChange}
                        suffix=" mins"
                        allowNegative={false}
                        error={errors?.round?.message}
                        withAsterisk
                      />
                    )}
                  />
                </Flex>
                <Flex className="gap-4">
                  <Controller
                    name="idleTime"
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <NumberInput
                        name={name}
                        label="Idle Time Between Rounds (in mins)"
                        placeholder="Idle Time (in mins)"
                        value={value}
                        className="w-[calc(50%-0.5rem)]"
                        suffix=" mins"
                        onChange={onChange}
                        error={errors?.round?.message}
                        allowNegative={false}
                        withAsterisk
                      />
                    )}
                  />
                  <Controller
                    name="minimumBidDecrementPercentage"
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <NumberInput
                        name={name}
                        label="Minimum Bid Decerement (in %)"
                        placeholder="Minimum Bid Decerement (in %)"
                        leftSection={<IconPercentage />}
                        value={value}
                        className="w-[calc(50%-0.5rem)]"
                        onChange={onChange}
                        error={errors?.round?.message}
                        suffix=" %"
                        allowNegative={false}
                        withAsterisk
                      />
                    )}
                  />
                </Flex>
              </Stack>
            )}
          </Stack>
        </Flex>
        <Flex className="ml-auto">
          <Button
            leftSection={<IconDeviceFloppy />}
            type="submit"
            loading={isCreating || isUpdating}
          >
            Save
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}

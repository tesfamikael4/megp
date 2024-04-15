'use client';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateVendorIdMutation } from '../../../_api/query';
import { usePrivilege } from '../../_context/privilege-context';
import { getNationalityValues } from '../mockup/nationality';
import style from './basic.module.scss';

type FormData = {
  name: string;
  origin: string;
  tinNumber: string;
  tinIssuedDate: string;
  registrationNumber: string;
  registrationIssuedDate: string;
};

const formDataSchema = z.discriminatedUnion('origin', [
  z.object({
    origin: z.literal('Malawi'),
    tinNumber: z
      .string()
      .min(6, { message: 'TIN must have at least 10 characters' })
      .max(10, { message: 'TIN should not exceed 10 characters' }),
    tinIssuedDate: z
      .string()
      .min(1, { message: 'TIN Issued Date is required' }),
    registrationNumber: z
      .string()
      .min(6, {
        message: 'Registration Number must have at least 10 characters',
      })
      .max(20, {
        message: 'Registration Number should not exceed 20 characters',
      }),
    registrationIssuedDate: z
      .string()
      .min(1, { message: 'Registration Number Issued Date is required' }),
  }),
  z.object({
    origin: z.enum(getNationalityValues('Malawi')),
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' })
      .max(100, { message: 'Name cannot exceed 100 characters' }),
    tinNumber: z.string().optional(),
    tinIssuedDate: z.string().optional(),
  }),
]);
interface BasicInformationProps {
  defaultValues: FormData;
}
export const BasicInformation = ({ defaultValues }: BasicInformationProps) => {
  const {
    handleSubmit,
    formState,
    register,
    setValue,
    watch,
    setError,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues,
  });

  const {
    checkAccess,
    lockElements,
    nextRoute,
    navigateToNextRoute,
    accessStatus,
    updateAccess,
    updateStatus,
  } = usePrivilege();

  console.log({ errors: formState.errors });

  useEffect(() => {
    updateAccess('basic');
    updateStatus('Draft');

    return () => {};
  }, [updateAccess]);

  const router = useRouter();
  const [accept, setAccept] = useState<boolean>(false);
  const [create, createValues] = useCreateVendorIdMutation();

  const onSubmit = (data: typeof formState.defaultValues) => {
    create({
      name: data?.name ?? '_',
      origin: data?.origin ?? '',
      tinNumber: data?.tinNumber ?? '',
      tinIssuedDate: data?.tinIssuedDate ?? '',
      registrationNumber: data?.registrationNumber ?? '',
      registrationIssuedDate: data?.registrationIssuedDate ?? '',
    });
  };

  useEffect(() => {
    if (createValues.isSuccess && createValues.data?.vendorId) {
      NotificationService.successNotification(
        'Request Submitted Successfully!',
      );
      router.push(`detail`);
    }
    if (createValues.data?.message) {
      setError('tinNumber', { message: createValues.data?.message });
      NotificationService.requestErrorNotification(createValues.data?.message);
    }
    if (createValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createValues.data, createValues.isError, createValues.isSuccess, router]);

  return (
    <Box className={style.reqFormCard}>
      <LoadingOverlay
        visible={createValues.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex className="flex-col gap-2 w-full">
          <Select
            className="w-full"
            label="Country of Registration"
            searchable
            value={getValues('origin')}
            data={getNationalityValues()}
            {...register('origin')}
            onChange={async (value) =>
              value && (await setValue('origin', value))
            }
            error={formState.errors.origin && formState.errors.origin.message}
            {...lockElements('basic')}
            required
          />
          {watch().origin !== 'Malawi' && (
            <>
              <TextInput
                className="w-full"
                label="Name of Business/Company"
                id="name"
                {...register(`name`)}
                error={formState.errors.name && formState.errors.name.message}
                {...lockElements('basic')}
              />

              <TextInput
                className="w-full"
                label="TIN"
                id="tinNumber"
                {...register(`tinNumber`)}
                error={
                  formState.errors.tinNumber &&
                  formState.errors.tinNumber.message
                }
                {...lockElements('basic')}
              />
            </>
          )}

          {watch().origin === 'Malawi' ? (
            <>
              <TextInput
                className="w-full"
                label="TIN"
                required
                id="tinNumber"
                {...register(`tinNumber`)}
                error={
                  formState.errors.tinNumber &&
                  formState.errors.tinNumber.message
                }
                {...lockElements('basic')}
              />
              <DatePickerInput
                valueFormat="YYYY/MM/DD"
                required
                label="TIN Issued date"
                leftSection={<IconCalendar size={'1.2rem'} stroke={1.5} />}
                maxDate={dayjs(new Date()).toDate()}
                onChange={async (value: any) =>
                  // console.log(dayjs(value).format('YYYY/MM/DD'))
                  value &&
                  (await setValue(
                    'tinIssuedDate',
                    dayjs(value)
                      .format('YYYY/MM/DD')
                      .toString()
                      .replace(/\//g, '-'),
                  ))
                }
                error={
                  formState.errors.tinIssuedDate &&
                  formState.errors.tinIssuedDate.message
                }
                {...lockElements('basic')}
              />
              <TextInput
                className="w-full"
                label="Registration Number"
                id="name"
                {...register(`registrationNumber`)}
                error={
                  formState.errors.registrationNumber &&
                  formState.errors.registrationNumber.message
                }
                {...lockElements('basic')}
              />

              <DatePickerInput
                valueFormat="YYYY/MM/DD"
                required
                label="Registration Issued date"
                leftSection={<IconCalendar size={'1.2rem'} stroke={1.5} />}
                maxDate={dayjs(new Date()).toDate()}
                onChange={async (value: any) =>
                  value &&
                  (await setValue(
                    'registrationIssuedDate',
                    dayjs(value)
                      .format('YYYY/MM/DD')
                      .toString()
                      .replace(/\//g, '-'),
                  ))
                }
                error={
                  formState.errors.registrationIssuedDate &&
                  formState.errors.registrationIssuedDate.message
                }
                {...lockElements('basic')}
              />
            </>
          ) : (
            ''
          )}
        </Flex>
        <Divider size="md" my={20} />
        <Flex className="gap-4">
          <Checkbox
            label={
              <Text size={'xs'}>
                I accept by continuing using the system you certify that you
                have read the above service request instruction and accept the
                applicable Terms and Conditions
              </Text>
            }
            onChange={() => setAccept(!accept)}
            checked={accept}
            {...lockElements('basic')}
          />
        </Flex>

        <Flex className="mt-10 justify-end gap-2">
          {checkAccess('basic') ? (
            <Button type="submit" disabled={!accept}>
              Start Registration
            </Button>
          ) : (
            nextRoute && (
              <Button onClick={() => navigateToNextRoute()}>Next</Button>
            )
          )}
        </Flex>
      </form>
    </Box>
  );
};
``;

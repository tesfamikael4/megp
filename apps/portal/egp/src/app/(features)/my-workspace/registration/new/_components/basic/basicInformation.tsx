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

const errorMessages = {
  'no tin number issued date found': 'TIN number issued date is missing.',
  'no registration number found': 'Registration number is missing.',
  'no registration number issued date found':
    'Registration number issued date is missing.',
  invalid_tin_number: 'The provided TIN number is invalid.',
  'incorrect tin number issued date':
    'The TIN number issued date is incorrect.',
  mbrs_fetch_error: 'Error fetching data from MBRS.',
  you_are_not_registered_on_mbrs: 'You are not registered on MBRS.',
  incorrect_registration_date: 'The registration issued date is incorrect.',
};
const errorMappingwithZod = {
  'no tin number issued date found': 'tinNumber',
  'no registration number found': 'registrationNumber',
  'no registration number issued date found': 'registrationIssuedDate',
  invalid_tin_number: 'tinNumber',
  'incorrect tin number issued date': 'tinIssuedDate',
  mbrs_fetch_error: 'Error fetching data from MBRS.',
  you_are_not_registered_on_mbrs: 'You are not registered on MBRS.',
  incorrect_registration_date: 'registrationIssuedDate',
};

type FormData = {
  name: string;
  countryOfRegistration: string;
  tinNumber: string;
  tinIssuedDate: string;
  registrationNumber: string;
  registrationIssuedDate: string;
};

const formDataSchema = z.discriminatedUnion('countryOfRegistration', [
  z.object({
    countryOfRegistration: z.literal('Malawi'),
    tinNumber: z
      .string()
      .min(8, { message: 'TIN must have at least 8 characters' })
      .max(10, { message: 'TIN should not exceed 10 characters' }),
    tinIssuedDate: z
      .string()
      .min(1, { message: 'TIN Issued Date is required' }),
    registrationNumber: z.string().min(6, {
      message: 'Registration Number must have at least 10 characters',
    }),
    registrationIssuedDate: z
      .string()
      .min(1, { message: 'Registration Number Issued Date is required' }),
  }),
  z.object({
    countryOfRegistration: z.enum(getNationalityValues('Malawi')),
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
      countryOfRegistration: data?.countryOfRegistration ?? '',
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
      if (errorMessages[(createValues.error as any).data?.message]) {
        NotificationService.requestErrorNotification(
          errorMessages[(createValues.error as any).data?.message],
        );
        const errorKey =
          errorMappingwithZod[(createValues.error as any).data?.message];

        if (errorKey)
          setError(errorKey, {
            message: errorMessages[(createValues.error as any).data?.message],
          });
      } else NotificationService.requestErrorNotification('Error on Request');
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
            value={getValues('countryOfRegistration')}
            data={getNationalityValues()}
            {...register('countryOfRegistration')}
            onChange={async (value) =>
              value && (await setValue('countryOfRegistration', value))
            }
            error={
              formState.errors.countryOfRegistration &&
              formState.errors.countryOfRegistration.message
            }
            {...lockElements('basic')}
            required
          />
          {watch().countryOfRegistration !== 'Malawi' && (
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
                label="Taxpayer Identification Number (TIN)"
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
            </>
          )}

          {watch().countryOfRegistration === 'Malawi' ? (
            <>
              <TextInput
                className="w-full"
                label="Taxpayer Identification Number (TIN)"
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
                label="Business Registration Number"
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
                label="Business Registration Issued date"
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

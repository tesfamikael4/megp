'use client';
import React, { useEffect, useState } from 'react';
import {
  Select,
  Flex,
  Text,
  Divider,
  TextInput,
  Box,
  Button,
  Checkbox,
  LoadingOverlay,
} from '@mantine/core';
import { DateInput, DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';

import style from './basic.module.scss';
import { useRouter } from 'next/navigation';
import {
  getNationalityValues,
  nationalityOptions,
} from '../mockup/nationality';
import { ChangeHandler, UseFormRegisterReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormOfBusiness } from '../mockup/form-of-business';
import { useCreateVendorIdMutation } from '../../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { IconCalendar } from '@tabler/icons-react';
import { setCookie } from 'cookies-next';
import { usePrivilege } from '../../_context/privilege-context';

type FormData = {
  name: string;
  businessType: string;
  origin: string;
  tinNumber: string;
  tinIssuedDate: string;
};

const formDataSchema = z.discriminatedUnion('origin', [
  z.object({
    origin: z.literal('MW'),
    tinNumber: z
      .string()
      .min(6, { message: 'TIN Number must have at least 10 characters' })
      .max(10, { message: 'TIN Number should not exceed 10 characters' }),
    tinIssuedDate: z.string(),
  }),
  z.object({
    origin: z.enum(getNationalityValues('MW')),
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' })
      .max(100, { message: 'Name cannot exceed 100 characters' }),
    businessType: z
      .string()
      .min(2, { message: 'Form of business is required' }),
    tinNumber: z.string().optional(),
    tinIssuedDate: z.string().optional(),
  }),
]);

export const BasicInformation = () => {
  const { handleSubmit, formState, register, setValue, watch, setError } =
    useForm<FormData>({
      resolver: zodResolver(formDataSchema),
      defaultValues: {
        name: '',
        businessType: '',
        origin: '',
        tinNumber: '',
        tinIssuedDate: '',
      },
    });
  const { checkAccess, lockElements } = usePrivilege();
  const router = useRouter();
  const [accept, setAccept] = useState<boolean>(false);
  const [create, createValues] = useCreateVendorIdMutation();
  const onSubmit = (data: typeof formState.defaultValues) => {
    console.log(data);
    create({
      name: data?.name ?? '',
      businessType: data?.businessType ?? '',
      origin: data?.origin ?? '',
      tinNumber: data?.tinNumber ?? '',
      tinIssuedDate: data?.tinIssuedDate ?? '',
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
            label="Country of origin"
            searchable
            data={nationalityOptions}
            {...register('origin')}
            onChange={async (value) =>
              value && (await setValue('origin', value))
            }
            error={formState.errors.origin && formState.errors.origin.message}
            {...lockElements('basic')}
            required
          />
          {watch().origin !== 'MW' && watch().origin !== '' ? (
            <>
              <TextInput
                className="w-full"
                label="Name of Business/Company"
                id="name"
                {...register(`name`)}
                error={formState.errors.name && formState.errors.name.message}
                {...lockElements('basic')}
              />
              <Select
                className="w-full"
                label="Form of Business"
                searchable
                data={FormOfBusiness}
                {...register('businessType')}
                onChange={async (value) =>
                  value && (await setValue('businessType', value))
                }
                error={
                  formState.errors.businessType &&
                  formState.errors.businessType.message
                }
                {...lockElements('basic')}
              />
            </>
          ) : (
            ''
          )}

          <TextInput
            className="w-full"
            label="Tin Number"
            id="tinNumber"
            {...register(`tinNumber`)}
            error={
              formState.errors.tinNumber && formState.errors.tinNumber.message
            }
            {...lockElements('basic')}
          />
          <DatePickerInput
            valueFormat="YYYY/MM/DD"
            label="Tin Issued date"
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
          {checkAccess('basic') && (
            <Button type="submit" disabled={!accept}>
              Start Registration
            </Button>
          )}
        </Flex>
      </form>
    </Box>
  );
};
``;

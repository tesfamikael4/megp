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
import {
  useCreateVendorIdMutation,
  useLazyGetMRADataQuery,
} from '../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { IconCalendar } from '@tabler/icons-react';
import { setCookie } from 'cookies-next';

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
    tinNumber: z.string().optional(),
    tinIssuedDate: z.string().optional(),
    businessType: z
      .string()
      .min(2, { message: 'Form of business is required' }),
  }),
]);

export const BasicInformation = () => {
  const { handleSubmit, formState, register, setValue, watch } =
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

  const router = useRouter();
  const [accept, setAccept] = useState<boolean>(false);
  const [create, createValues] = useCreateVendorIdMutation();
  const [getMRAData, getMRADataValues] = useLazyGetMRADataQuery({});

  const onSubmit = (data: typeof formState.defaultValues) => {
    if (data?.origin == 'MW') {
      getMRAData({
        tin: data?.tinNumber,
        issuedDate: data?.tinIssuedDate,
      });
    } else {
      create({
        name: data?.name || '',
        businessType: data?.businessType || '_',
        origin: data?.origin || '',
        country: data?.origin || ' ',
        tinNumber: data?.tinNumber || '',
        tinIssuedDate: data?.tinIssuedDate || '',
        district: '',
      });
    }
  };

  useEffect(() => {
    if (createValues.isSuccess && createValues.data?.vendorId) {
      setCookie('vendorId', createValues.data.vendorId);
      NotificationService.successNotification('Form Created Successfully!');
      router.push(`detail`);
    }
    if (createValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }

    return () => {};
  }, [createValues.data, createValues.isError, createValues.isSuccess, router]);

  useEffect(() => {
    if (getMRADataValues.isSuccess && getMRADataValues.data == null) {
      console.log(getMRADataValues.data);
      NotificationService.requestErrorNotification('Invalid Request');
    }
    if (getMRADataValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [
    getMRADataValues.data,
    getMRADataValues.isError,
    getMRADataValues.isSuccess,
  ]);

  useEffect(() => {
    if (getMRADataValues.data) {
      create({
        name: getMRADataValues.data?.TaxpayerName || '',
        businessType: watch().businessType || '',
        origin: watch().origin,
        country: watch().origin,
        tinNumber: watch().tinNumber,
        tinIssuedDate: watch().tinIssuedDate,
        district: getMRADataValues.data?.PostalAddress || '',
      });
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMRADataValues.data]);
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
          />
          {watch().origin !== 'MW' && watch().origin !== '' ? (
            <>
              <TextInput
                className="w-full"
                label="Name of Business/Company"
                id="name"
                {...register(`name`)}
                error={formState.errors.name && formState.errors.name.message}
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
          />
        </Flex>

        <Flex className="mt-10 justify-end gap-2">
          <Button type="submit" disabled={!accept}>
            Start Registration
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
``;

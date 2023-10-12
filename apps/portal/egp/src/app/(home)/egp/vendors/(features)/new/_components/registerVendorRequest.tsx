'use client';
import React, { useEffect } from 'react';
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
import style from './register.module.scss';
import { useRouter } from 'next/navigation';
import { nationalityOptions } from '../../../_components/mockdata/nationality';
import { ChangeHandler, UseFormRegisterReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateVendorIdMutation } from '@/store/api/vendor_registration/query';
import { NotificationService } from '../../../_components/notification';

export interface ExtendedRegistrationReturnType
  extends UseFormRegisterReturn<any> {
  value?: any;
  onFocus: (event: { target: any; type?: any }) => Promise<boolean | void>;
  onChange: (props: ChangeHandler | any) => Promise<void | boolean>;
  error: string | undefined;
}

type FormData = {
  basic: {
    name: string;
    businessType: string;
    origin: string;
    district: string;
    country: string;
    tinNumber: string;
  };
};
export const formDataSchema = z.object({
  basic: z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' })
      .max(100, { message: 'Name cannot exceed 100 characters' }),
    businessType: z
      .string()
      .min(2, { message: 'Form of business is required' }),
    origin: z.string(),
    district: z.string(),
    country: z.string(),
    tinNumber: z.string(),
  }),
});
export const RegisterVendorRequestForm = () => {
  const {
    handleSubmit,
    formState,
    register,
    getFieldState,
    setValue,
    trigger,
    clearErrors,
    watch,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: {
      basic: {
        name: '',
        businessType: '',
        origin: '',
        district: '',
        country: '',
        tinNumber: '',
      },
    },
  });
  const extendedRegister = (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file',
  ): ExtendedRegistrationReturnType => {
    const fieldRegister = register(name);
    const fieldState = getFieldState(name, formState);

    return {
      ...fieldRegister,
      ...(type === 'select' ? { value: getValues(name) } : {}),
      onBlur: async (event: {
        target: any;
        type?: any;
      }): Promise<boolean | void> => {
        trigger(name);
        return await fieldRegister.onBlur(event);
      },
      onFocus: async (event: {
        target: any;
        type?: any;
      }): Promise<boolean | void> => {
        clearErrors(name);
        return await fieldRegister.onBlur(event);
      },
      onChange:
        type === 'select' || type === 'file'
          ? async (e) => await setValue(name, e)
          : fieldRegister.onChange,
      error: fieldState.error?.message,
    };
  };
  const router = useRouter();

  const [createVendorId, requestInfo] = useCreateVendorIdMutation();

  const onSubmit = (data: typeof formState.defaultValues) => {
    createVendorId({
      status: 'Save as Draft',
      name: data?.basic?.name || '',
      businessType: data?.basic?.businessType || '',
      origin: data?.basic?.origin || '',
      district: data?.basic?.district || '',
      country: data?.basic?.country || '',
      tinNumber: data?.basic?.tinNumber || '',
    });
  };

  useEffect(() => {
    if (requestInfo.isSuccess && requestInfo.data?.vendorId) {
      NotificationService.successNotification('Form Created Successfully!');
      router.push(`new/${requestInfo.data.vendorId}`);
    }

    return () => {};
  }, [requestInfo.data, requestInfo.isSuccess, router]);

  return (
    <Box className={style.reqFormCard}>
      <LoadingOverlay
        visible={requestInfo.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex className="flex-col gap-2 w-full">
          <Flex>
            <TextInput
              className="w-full"
              label="Name of Business/Company"
              id="name"
              {...extendedRegister(`basic.name`)}
            />
          </Flex>

          <Flex>
            <Select
              className="w-full"
              label="Form of Business"
              searchable
              data={[
                {
                  label: 'Sole Proprietorship',
                  value: 'Sole Proprietorship',
                },
                {
                  label: 'Partnership',
                  value: 'Partnership',
                },
                {
                  label: 'Private Limited Company',
                  value: 'Private Limited Company',
                },
                {
                  label: 'Share Company',
                  value: 'Share Company',
                },
                {
                  label: 'Government-Owned Enterprise',
                  value: 'Government-Owned Enterprise',
                },
              ]}
              {...extendedRegister('basic.businessType', 'select')}
            />
          </Flex>

          <Flex>
            <TextInput
              className="w-full"
              label="Business/Company Origin"
              id="origin"
              {...extendedRegister(`basic.origin`)}
            />
          </Flex>

          <Flex>
            <TextInput
              className="w-full"
              label="District"
              id="district"
              {...extendedRegister(`basic.district`)}
            />
          </Flex>

          <Flex>
            <Select
              className="w-full"
              label="Country"
              searchable
              data={nationalityOptions}
              {...extendedRegister(`basic.country`, 'select')}
            />
          </Flex>

          <Flex>
            <TextInput
              className="w-full"
              label="Tin Number"
              id="tinNumber"
              {...extendedRegister(`basic.tinNumber`)}
            />
          </Flex>
        </Flex>
        <Divider size="md" my={20} />
        <Flex className="gap-4">
          <Checkbox />
          <Text size={'xs'}>
            By continuing using the system you certify that you have read the
            above service request instruction and accept the applicable Terms
            and Conditions
          </Text>
        </Flex>

        <Flex className="mt-10 justify-end">
          <Button type="submit">Start Registration</Button>
        </Flex>
      </form>
    </Box>
  );
};

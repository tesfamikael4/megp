'use client';
import React, { useEffect, useState } from 'react';
import { Flex, Box, Button, Checkbox, LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Control, RegisterOptions, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useAddFormMutation,
  useCreateVendorIdMutation,
  useLazyGetMRADataQuery,
} from '../../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { FormData } from '@/models/vendorRegistration';
import { ExtendedRegistrationReturnType } from '../detail/formShell';
import AreasOfBusinessInterest from './areasOfBusinessInterest';
import { usePrivilege } from '../../_context/privilege-context';

export interface PassFormDataProps {
  register: (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file',
    options?: RegisterOptions<FormData, any> | undefined,
  ) => ExtendedRegistrationReturnType;
  control: Control<FormData, any>;
}
export const lineOfBusinessSchema = z.object({
  id: z
    .string()
    .min(2, { message: 'At least one Line Of Business Interest is required' }),
});

export const areasOfBusinessInterestSchema = z.object({
  lineOfBusiness: z
    .array(lineOfBusinessSchema)
    .refine((arr) => arr.length > 0, {
      message: 'At least one Line Of Business Interest is required',
    }),
  priceRange: z.string().min(2, { message: 'Price Range is required' }),
});

export const formDataSchema = z.object({
  areasOfBusinessInterest: z
    .array(areasOfBusinessInterestSchema)
    .refine((arr) => arr.length > 0, {
      message: 'At least one Areas Of Business Interest is required',
    }),
});

export const AreasOfBusinessInterestForm = ({
  initialValues,
  vendorInfo,
}: {
  initialValues: FormData;
  vendorInfo: {
    userId: string; //session
    status: string;
    level: string;
  };
}) => {
  const {
    handleSubmit,
    formState,
    register,
    setValue,
    watch,
    getFieldState,
    getValues,
    control,
    trigger,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: initialValues,
  });

  const router = useRouter();
  const [save, saveValues] = useAddFormMutation();
  const { checkAccess, lockElements, updateAccess } = usePrivilege();

  useEffect(() => {
    return () => {
      updateAccess(vendorInfo.level);
    };
  }, [updateAccess, vendorInfo.level]);
  useEffect(() => {
    if (saveValues.isSuccess) {
      NotificationService.successNotification('Submitted Successfully!');
      router.push(`payment`);
    }
    if (saveValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [saveValues.isSuccess, saveValues.isError, router]);

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
      ...lockElements('ppda'),
    };
  };

  const onSubmit = (data: typeof formState.defaultValues) => {
    save({
      data: {
        ...getValues(),
        initial: {
          ...vendorInfo,
          level: 'payment',
        },
      },
    });
  };
  return (
    <Box className="p-2 w-full relative">
      <LoadingOverlay
        visible={saveValues.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex className="flex-col gap-2 w-full">
          <AreasOfBusinessInterest
            name="areasOfBusinessInterest"
            control={control}
            register={extendedRegister}
          />
        </Flex>
        <Flex className="mt-10 justify-end gap-2">
          {checkAccess('ppda') && <Button type="submit">Submit</Button>}
        </Flex>
      </form>
    </Box>
  );
};

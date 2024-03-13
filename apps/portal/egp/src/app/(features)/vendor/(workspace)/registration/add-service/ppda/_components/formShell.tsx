'use client';
import { useEffect } from 'react';
import { Flex, Box, Button, LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Control, RegisterOptions, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useAddAdditionalServiceMutation,
  useAddFormMutation,
} from '../../../_api/query';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { AreasOfBusinessInterest } from './areasOfBusinessInterest';
import { ExtendedRegistrationReturnType } from '../../../_components/detail/formShell';

export const lineOfBusinessSchema = z.object({
  id: z
    .string()
    .min(2, { message: 'At least one Line Of Business Interest is required' }),
});

export const areasOfBusinessInterestSchema = z.object({
  category: z.string().min(2, { message: 'Category is required' }),
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

export interface PassFormDataProps {
  register: (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file',
    options?: RegisterOptions<z.infer<typeof formDataSchema>, any> | undefined,
  ) => ExtendedRegistrationReturnType;
  control: Control<z.infer<typeof formDataSchema>, any>;
}

export const AreasOfBusinessInterestForm = ({
  initialValues,
  vendorInfo,
}: {
  initialValues: z.infer<typeof formDataSchema>;
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
  } = useForm<z.infer<typeof formDataSchema>>({
    resolver: zodResolver(formDataSchema),
    defaultValues: initialValues,
  });

  const router = useRouter();
  const [saveAdditionalService, { isLoading: isSaving }] =
    useAddAdditionalServiceMutation({});

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

  const onSubmit = async (values) => {
    try {
      await saveAdditionalService(values.areasOfBusinessInterest)
        .unwrap()
        .then((response) => {
          if (response && response.length > 0) {
            if (response.some((item) => item.canPay)) {
              NotificationService.successNotification(
                'PPDA successfully created',
              );
              router.push('payment');
            }
          }
        });
    } catch (error) {
      NotificationService.requestErrorNotification(error.data.message);
    }
  };

  return (
    <Box className="p-2 w-full relative">
      <LoadingOverlay
        visible={isSaving}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex className="flex-col gap-2 w-full">
          <AreasOfBusinessInterest
            name="areasOfBusinessInterest"
            control={control}
            register={extendedRegister}
            adjustment={vendorInfo?.status === 'Adjustment' ? false : true}
          />
        </Flex>
        <Flex justify={'flex-end'} mt={'md'}>
          {watch('areasOfBusinessInterest')?.length > 0 && (
            <Button type="submit" size="sm" disabled={isSaving}>
              Add Service
            </Button>
          )}
        </Flex>
      </form>
    </Box>
  );
};

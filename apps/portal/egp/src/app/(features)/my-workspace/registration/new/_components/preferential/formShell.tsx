'use client';
import React, { useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Button,
  Checkbox,
  LoadingOverlay,
  TextInput,
  Group,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import {
  Control,
  Controller,
  RegisterOptions,
  UseFormSetValue,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { FormData } from '@/models/vendorRegistration';
import PreferentialTreatment from './preferentialTreatment';
import { usePrivilege } from '../../_context/privilege-context';
import {
  useSubmitRequestMutation,
  useUploadPreferentialAttachmentsMutation,
} from '@/store/api/preferential-treatment/preferential-treatment.api';
import { ExtendedRegistrationReturnType } from '../../../_components/detail/formShell';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';

export interface PassFormDataProps {
  register: (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file',
    options?: RegisterOptions<FormData, any> | undefined,
  ) => ExtendedRegistrationReturnType;
  control: Control<FormData, any>;
  setValue?: UseFormSetValue<FormData>;
}
export const preferentialSchema = z.discriminatedUnion('category', [
  z.object({
    category: z.enum(['ibm', 'marginalized']),
    serviceId: z.string(),
    certificateValidityPeriod: z.string(), // Certificate validity period
    certificateIssuedDate: z.string(), // Certificate issuance date
  }),
  z.object({
    category: z.literal('msme'),
    serviceId: z.string(),
    type: z.union([
      z.literal('Small'),
      z.literal('Micro'),
      z.literal('Medium'),
    ]), // Type of MSME
    certificateValidityPeriod: z.string(), // Certificate validity period
    certificateIssuedDate: z.string(), // Certificate issuance date
  }),
]);

export const formDataSchema = z.object({
  preferential: z.array(preferentialSchema).optional(),
});

export const PreferentialTreatmentForm = ({
  initialValues,
  vendorInfo,
}: {
  initialValues: FormData;
  vendorInfo: {
    userId: string;
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
  const [save, saveValues] = useSubmitRequestMutation();
  const [saveAttachment, saveAttachmentValues] =
    useUploadPreferentialAttachmentsMutation();
  const { checkAccess, lockElements, updateAccess } = usePrivilege();

  useEffect(() => {
    return () => {
      updateAccess(vendorInfo.level);
    };
  }, [updateAccess, vendorInfo.level]);
  useEffect(() => {
    if (saveAttachmentValues.isSuccess) {
      NotificationService.successNotification('Submitted Successfully!');
      router.push(`payment`);
    }
    if (saveAttachmentValues.isError) {
      NotificationService.requestErrorNotification('Error on Request');
    }
    return () => {};
  }, [saveAttachmentValues.isSuccess, saveAttachmentValues.isError]);

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

  const onSubmit = async (data: typeof formState.defaultValues) => {
    const preferential = getValues().preferential.map(
      ({
        certiNumber,
        serviceId,
        certificateIssuedDate,
        certificateValidityPeriod,
        category,
        type,
      }) => {
        return {
          category,
          type,
          certiNumber,
          certificateIssuedDate,
          certificateValidityPeriod,
          serviceId,
          status: 'Draft',
        };
      },
    );
    try {
      await save(preferential)
        .unwrap()
        .then(() => {
          saveAttachment(getValues().preferential);
        });
    } catch (error) {
      NotificationService.requestErrorNotification(error.message);
    }
  };
  return (
    <Box className="p-2 w-full relative">
      <LoadingOverlay
        visible={saveValues.isLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex className="flex-col gap-2 w-full">
          <PreferentialTreatment
            name="preferential"
            control={control}
            register={extendedRegister}
            adjustment={vendorInfo.status === 'Adjustment' ? false : true}
          />
          {watch('preferential') &&
            watch('preferential').length > 0 &&
            watch('basic.countryOfRegistration') === 'Malawi' && (
              <Group grow>
                <TextInput
                  label="Preferential Registration Number"
                  placeholder="Enter Preferential Registration Number"
                />
                {/* <Controller
                  name={`preferentialRegistrationDate`}
                  control={control}
                  render={({ field }) => ( */}
                <DatePickerInput
                  // name={`areasOfBusinessInterest.${index}.activationDate`}
                  valueFormat="YYYY/MM/DD"
                  required
                  label="Activation Date"
                  placeholder="Activation Date"
                  leftSection={<IconCalendar size={'1.2rem'} stroke={1.5} />}
                  maxDate={dayjs(new Date()).toDate()}
                  // {...register(`areasOfBusinessInterest.${index}.activationDate`)}
                  // onChange={async (value: any) =>
                  //   value &&
                  //   field.onChange(
                  //     dayjs(value)
                  //       .format('YYYY/MM/DD')
                  //       .toString()
                  //       .replace(/\//g, '-'),
                  //   )
                  // }
                />
              </Group>
            )}
        </Flex>

        <Flex className="mt-10 justify-end gap-2">
          <Button onClick={() => router.push('payment')} variant="outline">
            Back
          </Button>
          {watch('preferential') && watch('preferential').length > 0 ? (
            <>
              {checkAccess('preferential') ? (
                <Button type="submit">Save & Continue</Button>
              ) : (
                <Button onClick={() => router.push('payment')}>Continue</Button>
              )}
            </>
          ) : (
            <Button onClick={() => router.push('payment')}>Skip</Button>
          )}
        </Flex>
      </form>
    </Box>
  );
};

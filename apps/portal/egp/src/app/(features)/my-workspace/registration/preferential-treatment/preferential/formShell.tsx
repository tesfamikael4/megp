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
  RegisterOptions,
  UseFormSetValue,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotificationService } from '@/app/(features)/vendor/_components/notification';
import { FormData } from '@/models/vendorRegistration';
import PreferentialTreatment from './preferentialTreatment';
import {
  useSubmitRequestMutation,
  useUploadPreferentialAttachmentsMutation,
} from '@/store/api/preferential-treatment/preferential-treatment.api';
import { ExtendedRegistrationReturnType } from '../../_components/detail/formShell';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';

export interface PassFormDataProps {
  register: (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file',
    options?: RegisterOptions<z.infer<typeof formDataSchema>, any> | undefined,
  ) => ExtendedRegistrationReturnType;
  control: Control<z.infer<typeof formDataSchema>, any>;
  setValue?: UseFormSetValue<z.infer<typeof formDataSchema>>;
}
export const preferentialSchema = z.discriminatedUnion('category', [
  z.object({
    category: z.enum(['ibm', 'marginalized']),
    serviceId: z.string(),
    certiNumber: z.string(),
    certificateUrl: z.instanceof(File).optional(),
  }),
  z.object({
    category: z.literal('msme'),
    serviceId: z.string(),
    type: z.union([
      z.literal('Small'),
      z.literal('Micro'),
      z.literal('Medium'),
    ]), // Type of MSME
    certiNumber: z.string(), // Certificate issuance date
    certificateUrl: z.instanceof(File).optional(),
  }),
]);

export const formDataSchema = z.object({
  preferential: z.array(preferentialSchema).optional(),
});

export const PreferentialTreatmentForm = ({
  initialValues,
  countryOfRegistration,
}: {
  initialValues: z.infer<typeof formDataSchema>;
  countryOfRegistration: string;
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
    defaultValues: initialValues as z.infer<typeof formDataSchema>,
  });
  console.log(formState.errors, watch());

  const router = useRouter();
  const [save, saveValues] = useSubmitRequestMutation();
  const [saveAttachment, saveAttachmentValues] =
    useUploadPreferentialAttachmentsMutation();

  useEffect(() => {
    if (saveAttachmentValues.isSuccess) {
      NotificationService.successNotification('Submitted Successfully!');
      router.push(`/my-workspace/registration/track-applications`);
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
    };
  };

  const onSubmit = async (data: typeof formState.defaultValues) => {
    const preferential =
      getValues().preferential &&
      (getValues().preferential as any).map(
        ({
          certiNumber,
          category,
          type,
          serviceId,
          certificateIssuedDate,
          certificateValidityPeriod,
        }) => {
          return {
            certiNumber,
            category,
            type,
            certificateIssuedDate,
            certificateValidityPeriod,
            serviceId,
            status: 'Submit',
          };
        },
      );
    try {
      await save(preferential as any)
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
            // adjustment={vendorInfo.status === 'Adjustment' ? false : true}
          />
        </Flex>

        <Flex className="mt-10 justify-end gap-2">
          <Button onClick={() => router.push('payment')} variant="outline">
            Back
          </Button>
          {watch('preferential') &&
          (watch('preferential') as any).length > 0 ? (
            <>
              <Button type="submit">Save & Continue</Button>
            </>
          ) : (
            <Button onClick={() => router.push('doc')}>Skip</Button>
          )}
        </Flex>
      </form>
    </Box>
  );
};

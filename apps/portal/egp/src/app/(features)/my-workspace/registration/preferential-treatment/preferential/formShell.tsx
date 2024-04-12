'use client';
import React, { useEffect } from 'react';
import { Flex, Box, Button, LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Control, RegisterOptions, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PreferentialTreatment from './preferentialTreatment';
import {
  useSubmitRequestMutation,
  useUploadPreferentialAttachmentsMutation,
} from '@/store/api/preferential-treatment/preferential-treatment.api';
import { ExtendedRegistrationReturnType } from '../../_components/detail/formShell';
import { NotificationService } from '../../../_components/notification';

export interface PassFormDataProps {
  register: (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file',
    options?: RegisterOptions<z.infer<typeof formDataSchema>, any> | undefined,
  ) => ExtendedRegistrationReturnType;
  control: Control<z.infer<typeof formDataSchema>, any>;
}
export const preferentialSchema = z.object({
  category: z.string(),
  type: z.string().min(2, { message: 'MSME is required' }),
  certificateUrl: z
    .instanceof(File, { message: 'Attachment is required', fatal: true })
    .refine((data) => data instanceof File, {
      message: 'Attachment is required',
    }),
  certiNumber: z.string().min(2, {
    message: 'Certificate Number must be at least 2 characters long ',
  }),
  serviceId: z.string().min(2, {
    message: 'Service ID must be at least 2 characters long ',
  }),
});

export const formDataSchema = z.object({
  preferential: z.array(preferentialSchema),
});

export const PreferentialTreatmentForm = ({
  initialValues,
}: {
  initialValues: z.infer<typeof formDataSchema>;
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
    const preferential = getValues().preferential.map(
      ({ certiNumber, serviceId }) => {
        return {
          certiNumber,
          serviceId,
          status: 'Submit',
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
        visible={saveAttachmentValues.isLoading}
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
          {watch('preferential') && watch('preferential').length > 0 && (
            <>
              <Button onClick={() => router.push('payment')} variant="outline">
                Back
              </Button>

              <Button type="submit">Save & Continue</Button>
            </>
          )}
        </Flex>
      </form>
    </Box>
  );
};

'use client';
import React, { useEffect, useState } from 'react';
import {
  useForm,
  Control,
  UseFormRegisterReturn,
  RegisterOptions,
  ChangeHandler,
} from 'react-hook-form';
import { Text, Button, Flex, LoadingOverlay, Accordion } from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { formDataSchema } from './schema';
import { FormData } from '@/models/vendorRegistration';
import { setCookie, hasCookie, getCookie } from 'cookies-next';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../../_components/notification';
import classes from './accordion.module.scss';
import { PopupModal } from '../../../../_components/modal';
import { useAddFormMutation } from '../../_api/query';
import { useTabs } from './accordion.data';

export interface ExtendedRegistrationReturnType
  extends UseFormRegisterReturn<any> {
  value?: any;
  onFocus: (event: { target: any; type?: any }) => Promise<boolean | void>;
  onChange: (props: ChangeHandler | any) => Promise<void | boolean>;
  error: string | undefined;
}
export interface PassFormDataProps {
  register: (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file',
    options?: RegisterOptions<FormData, any> | undefined,
  ) => ExtendedRegistrationReturnType;
  control: Control<FormData, any>;
}

function getFieldsHolderError(input: any, keyToCheck: string) {
  const result = {};
  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      const keys = key.split('.');
      let current: any = result;
      keys.forEach((subKey, index) => {
        if (index === keys.length - 1) {
          current[subKey] = '';
        } else {
          current[subKey] = current[subKey] || {};
          current = current[subKey];
        }
      });
    }
  }
  return keyToCheck in result;
}

const RegistrationForm = ({
  initialValues,
  vendorId,
}: {
  initialValues: FormData;
  vendorId: string;
}) => {
  const {
    control,
    handleSubmit,
    formState,
    register,
    getFieldState,
    setValue,
    trigger,
    clearErrors,
    getValues,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: initialValues,
  });

  const [submitTrigger, submitRequestInfo] = useAddFormMutation();
  const [saveAsDraftTrigger, saveAsDraftRequestInfo] = useAddFormMutation();
  const router = useRouter();

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

  const onSubmit = (data: FormData) => {
    submitTrigger({
      data: {
        ...data,
        areasOfBusinessInterest: [],
        id: vendorId,
        status: 'Save',
      },
    });
  };
  const onSaveAsDraft = () => {
    saveAsDraftTrigger({
      data: {
        ...getValues(),
        id: vendorId,
        status: 'Save as Draft',
        level: 'detail',
      },
    });
  };

  useEffect(() => {
    if (submitRequestInfo.isSuccess && submitRequestInfo.data) {
      NotificationService.successNotification('Form Submitted Successfully!');
      setCookie('vendorId', vendorId);
    }
    if (saveAsDraftRequestInfo.isSuccess && saveAsDraftRequestInfo.data) {
      NotificationService.successNotification('Form Saved Successfully!');
      setCookie('vendorId', vendorId);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    submitRequestInfo.data,
    submitRequestInfo.isSuccess,
    saveAsDraftRequestInfo.data,
    saveAsDraftRequestInfo.isSuccess,
    vendorId,
  ]);

  return (
    <Flex className="flex-col">
      <LoadingOverlay
        visible={
          submitRequestInfo.isLoading || saveAsDraftRequestInfo.isLoading
        }
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <Accordion variant="separated" classNames={classes}>
          {useTabs(extendedRegister, control).map((tab) => (
            <Accordion.Item
              key={tab.tabValue}
              className={classes.item}
              value={tab.tabValue}
            >
              <Accordion.Control
                icon={
                  getFieldsHolderError(formState.errors, tab.tabValue) && (
                    <Text color="red">*</Text>
                  )
                }
              >
                {tab.tabName}
              </Accordion.Control>
              <Accordion.Panel>
                <Flex className="w-full  rounded-md flex-col gap-4 p-4  justify-between shadow-sm min-h-[28rem] bg-[var(--mantine-color-body)]">
                  {tab.tabPanelComponent}
                  <Flex justify="end" className="gap-2">
                    <Button onClick={() => onSaveAsDraft()}>
                      Save as Draft
                    </Button>
                  </Flex>
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        <Flex justify="end" className="gap-2 mt-4">
          <Button type="submit">Save</Button>
        </Flex>
      </form>
    </Flex>
  );
};

export default RegistrationForm;

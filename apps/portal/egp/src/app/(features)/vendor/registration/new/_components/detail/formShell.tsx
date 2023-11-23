'use client';
import React, { useEffect } from 'react';
import {
  useForm,
  Control,
  UseFormRegisterReturn,
  RegisterOptions,
  ChangeHandler,
} from 'react-hook-form';
import {
  Text,
  Button,
  Flex,
  LoadingOverlay,
  Accordion,
  Stack,
} from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { formDataSchema } from './schema';
import { FormData } from '@/models/vendorRegistration';
import { setCookie } from 'cookies-next';

import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../../_components/notification';
import classes from './accordion.module.scss';
import {
  useAddFormMutation,
  useLazyGetMBRSDataQuery,
} from '../../../_api/query';
import { useTabs } from './accordion.data';
import { usePrivilege } from '../../_context/privilege-context';

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
    type?: 'input' | 'select' | 'checkbox' | 'file' | 'number',
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
  const { checkAccess, lockElements, updateAccess } = usePrivilege();
  const [submitTrigger, submitRequestInfo] = useAddFormMutation();
  const [saveAsDraftTrigger, saveAsDraftRequestInfo] = useAddFormMutation();

  useEffect(() => {
    return () => {
      updateAccess(vendorInfo.level);
    };
  }, [updateAccess, vendorInfo.level]);

  const router = useRouter();

  const extendedRegister = (
    name: any,
    type?: 'input' | 'select' | 'checkbox' | 'file' | 'number',
  ): ExtendedRegistrationReturnType => {
    const fieldRegister = register(name);
    const fieldState = getFieldState(name, formState);
    return {
      ...fieldRegister,
      ...(type === 'select' ? { value: getValues(name) } : {}),
      ...(type === 'number' ? { value: getValues(name) } : {}),

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
        type === 'select' || type === 'file' || type === 'number'
          ? async (e) => await setValue(name, e)
          : fieldRegister.onChange,
      error: fieldState.error?.message,
      ...lockElements('detail'),
    };
  };

  const onSubmit = (data: FormData) => {
    submitTrigger({
      data: {
        ...getValues(),
        initial: {
          ...vendorInfo,
          status: 'Save',
          level: 'ppda',
        },
      },
    });
  };
  const onSaveAsDraft = () => {
    saveAsDraftTrigger({
      data: {
        ...getValues(),
        initial: {
          ...vendorInfo,
          status: 'Save as Draft',
          level: 'detail',
        },
      },
    });
  };

  useEffect(() => {
    if (submitRequestInfo.isSuccess && submitRequestInfo.data) {
      NotificationService.successNotification('Form Submitted Successfully!');
      router.push(`ppda`);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitRequestInfo.data, submitRequestInfo.isSuccess]);

  useEffect(() => {
    if (saveAsDraftRequestInfo.isSuccess && saveAsDraftRequestInfo.data) {
      NotificationService.successNotification('Save as draft Successfully!');
    }
    return () => {};
  }, [saveAsDraftRequestInfo.data, saveAsDraftRequestInfo.isSuccess]);

  return (
    <Flex className="flex-col w-full relative">
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
                <Stack>
                  {tab.tabPanelComponent}
                  <Flex justify="end">
                    {checkAccess('detail') && (
                      <Button onClick={onSaveAsDraft}>Save as draft</Button>
                    )}
                  </Flex>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        <Flex justify="end" className="gap-2 mt-4">
          {checkAccess('detail') && <Button type="submit">Save</Button>}
        </Flex>
      </form>
    </Flex>
  );
};

export default RegistrationForm;

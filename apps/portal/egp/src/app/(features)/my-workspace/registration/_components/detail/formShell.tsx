'use client';
import { Suspense, useEffect } from 'react';
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

import { useRouter, useSearchParams } from 'next/navigation';
import classes from './accordion.module.scss';
import { useTabs } from './accordion.data';
import { usePrivilege } from '../../new/_context/privilege-context';
import { useAddFormMutation } from '../../_api/query';
import { NotificationService } from '@/app/(features)/my-workspace/_components/notification';
import {
  useSaveAsDraftApproveVendorInfoMutation,
  useUpdateSaveAsDraftApproveVendorInfoMutation,
} from '../../profile-update/_api/query';

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
  lockElements,
  disabled,
  isProfileUpdate,
}: {
  initialValues: FormData;
  vendorInfo: {
    userId: string; //session
    status: string;
    level: string;
  };
  lockElements: any;
  disabled: boolean;
  isProfileUpdate: boolean;
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
  const [updateTrigger, updateRequestInfo] =
    useUpdateSaveAsDraftApproveVendorInfoMutation();
  const [saveUpdateAsDraftTrigger, saveUpdateAsDraftRequestInfo] =
    useSaveAsDraftApproveVendorInfoMutation();
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
      ...lockElements,
    };
  };

  const onSubmit = async (data: FormData) => {
    try {
      await submitTrigger({
        data: {
          ...getValues(),
          initial: {
            ...vendorInfo,
            status: 'Save',
            level: 'ppda',
          },
        },
      })
        .unwrap()
        .then(() => {
          NotificationService.successNotification(
            'Form Submitted Successfully',
          );
          router.push(`ppda`);
        });
    } catch (error) {
      NotificationService.requestErrorNotification(
        'Something went wrong while submitting the field',
      );
    }
  };
  const onSaveAsDraft = async () => {
    try {
      await saveAsDraftTrigger({
        data: {
          ...getValues(),
          initial: {
            ...vendorInfo,
            status: 'Draft',
            level: 'detail',
          },
        },
      })
        .unwrap()
        .then(() => {
          NotificationService.successNotification(
            'Form Submitted Successfully',
          );
        });
    } catch (error) {
      NotificationService.requestErrorNotification(
        'Something went wrong while submitting the field',
      );
    }
  };
  const onUpdateSubmit = async (data: FormData) => {
    try {
      await updateTrigger({
        ...getValues(),
        initial: {
          ...vendorInfo,
          status: 'Draft',
          level: 'detail',
        },
      })
        .unwrap()
        .then(() => {
          NotificationService.successNotification(
            'Form Submitted Successfully',
          );
          router.push(`/my-workspace/registration/track-applications`);
        });
    } catch (error) {
      NotificationService.requestErrorNotification(
        'Something went wrong while submitting the field',
      );
    }
  };
  const onUPdateSaveAsDraft = async () => {
    try {
      await saveUpdateAsDraftTrigger({
        ...getValues(),
        initial: {
          ...vendorInfo,
          status: 'Draft',
          level: 'detail',
        },
      })
        .unwrap()
        .then(() => {
          NotificationService.successNotification(
            'Form Submitted Successfully',
          );
        });
    } catch (error) {
      NotificationService.requestErrorNotification(
        'Something went wrong while submitting the field',
      );
    }
  };

  return (
    <Suspense>
      <Flex className="flex-col w-full relative">
        <LoadingOverlay
          visible={
            submitRequestInfo.isLoading || saveAsDraftRequestInfo.isLoading
          }
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <form
          onSubmit={handleSubmit(isProfileUpdate ? onUpdateSubmit : onSubmit)}
          className="w-full"
        >
          <Accordion variant="separated" classNames={classes}>
            {useTabs(extendedRegister, control, disabled).map((tab) => {
              getFieldsHolderError(formState.errors, tab.tabValue);
              return (
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
                        {!disabled && (
                          <Button
                            onClick={
                              isProfileUpdate
                                ? onUPdateSaveAsDraft
                                : onSaveAsDraft
                            }
                          >
                            Save as draft
                          </Button>
                        )}
                      </Flex>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
          <Flex justify="end" className="gap-2 m-4">
            {!disabled && (
              <>
                <Button type="submit">
                  {isProfileUpdate ? 'Submit' : 'Save & Continue'}
                </Button>
              </>
            )}
          </Flex>
        </form>
      </Flex>
    </Suspense>
  );
};

export default RegistrationForm;

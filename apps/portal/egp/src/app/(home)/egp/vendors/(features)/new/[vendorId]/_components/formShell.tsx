'use client';
import React, { useEffect, useState } from 'react';
import {
  useForm,
  Control,
  UseFormRegisterReturn,
  RegisterOptions,
  ChangeHandler,
} from 'react-hook-form';
import { Text, Button, Code, Tabs, Flex, LoadingOverlay } from '@mantine/core';
import { BasicInfo } from './basicInfo';
import { ContactPersons } from './contactPersons';
import { zodResolver } from '@hookform/resolvers/zod';
import { BusinessSizeAndOwnership } from './businessSizeAndOwnership';
import { AddressInformation } from './addressInformation';
import { BankAccountDetails } from './bankAccountDetails';
import { ShareHolders } from './shareHolders';
import { BeneficialOwnership } from './beneficialOwnership';
import { SupportingDocuments } from './supportingDocuments';
import {
  bankAccountSchema,
  beneficialOwnershipSchema,
  contactPersonSchema,
  formDataSchema,
  shareHoldersSchema,
} from './schema';
import { useAddFormMutation } from '@/store/api/vendor_registration/query';
import { FormData } from '@/models/vendorRegistration';
import { setCookie, hasCookie, getCookie } from 'cookies-next';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../../_components/notification';
import { PopupModal } from '../../../../_components/modal';

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
  const [opened, modalHandler] = useDisclosure();
  const [submitTrigger, submitRequestInfo] = useAddFormMutation();
  const [saveAsDraftTrigger, saveAsDraftRequestInfo] = useAddFormMutation();
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    submitTrigger({
      data: {
        ...data,
        id: vendorId,
        status: 'Save',
      },
    });
  };
  const onSaveAsDraft = () => {
    saveAsDraftTrigger({
      data: {
        ...getValues(),
        status: 'Save as Draft',
        id: vendorId,
      },
    });
  };

  useEffect(() => {
    if (submitRequestInfo.isSuccess && submitRequestInfo.data) {
      NotificationService.successNotification('Form Submitted Successfully!');
      setCookie('vendorId', vendorId);
      modalHandler.open();
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
    modalHandler.open,
  ]);

  return (
    <Flex className="flex-col">
      <LoadingOverlay
        visible={
          submitRequestInfo.isLoading || saveAsDraftRequestInfo.isLoading
        }
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {opened ? (
        <PopupModal
          opened={opened}
          modalHandler={{
            ...modalHandler,
            close: () => {
              modalHandler.close();
              router.push('/egp/vendors/track-applications');
            },
          }}
        >
          <div className="sm:p-6 max-w-2xl sm:max-w-2xl w-full sm:w-full  transition-all shadow-box text-left  bg-white rounded-md overflow-hidden transform-translate-rotate-skew-scale relative">
            <div className=" rounded-full flex justify-center items-center w-12 h-12 mx-auto">
              <IconDeviceFloppy size={'3rem'} stroke={'0.6'} />
            </div>
            <Text size="xl" className="sm:mt-3 text-center my-1 ">
              Application Form Submitted Successfully
            </Text>
            <Text size="sm" className="sm:mt-3 text-center my-1 ">
              TN:{vendorId}
            </Text>
          </div>
        </PopupModal>
      ) : (
        ''
      )}
      <Tabs defaultValue="basic" orientation="vertical" variant="outline">
        <Tabs.List className="text-xs">
          <Tabs.Tab value="basic">
            <Flex gap={10}>
              <Text> Basic Registration</Text>
              {getFieldsHolderError(formState.errors, 'basic') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="address">
            <Flex gap={10}>
              <Text>Address Information</Text>
              {getFieldsHolderError(formState.errors, 'address') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="contactPersons">
            <Flex gap={10}>
              <Text>Contact Persons</Text>
              {getFieldsHolderError(formState.errors, 'contactPersons') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="businessSizeAndOwnership">
            <Flex gap={10}>
              <Text>Business Size and Ownership</Text>
              {getFieldsHolderError(
                formState.errors,
                'businessSizeAndOwnership',
              ) && <Text color="red">*</Text>}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="shareHolders">
            <Flex gap={10}>
              <Text>Shareholders</Text>
              {getFieldsHolderError(formState.errors, 'shareHolders') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="beneficialOwnership">
            <Flex gap={10}>
              <Text>Beneficial Ownership</Text>
              {getFieldsHolderError(
                formState.errors,
                'beneficialOwnership',
              ) && <Text color="red">*</Text>}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="areasOfBusinessInterest">
            <Flex gap={10}>
              <Text>Areas of Business Interest</Text>
              {getFieldsHolderError(
                formState.errors,
                'areasOfBusinessInterest',
              ) && <Text color="red">*</Text>}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="bankAccountDetails">
            <Flex gap={10}>
              <Text>Bank Account Details</Text>
              {getFieldsHolderError(formState.errors, 'bankAccountDetails') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="supportingDocuments">
            <Flex gap={10}>
              <Text> Supporting Documents</Text>
              {getFieldsHolderError(
                formState.errors,
                'supportingDocuments',
              ) && <Text color="red">*</Text>}
            </Flex>
          </Tabs.Tab>
        </Tabs.List>

        <Flex className="w-full flex-col gap-4 px-10 py-4 justify-between shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} id="res-big-form-submit">
            <Tabs.Panel value="basic">
              <BasicInfo register={extendedRegister} control={control} />
            </Tabs.Panel>

            <Tabs.Panel value="address">
              <AddressInformation
                register={extendedRegister}
                control={control}
              />
            </Tabs.Panel>
            <Tabs.Panel value="contactPersons">
              <ContactPersons
                name="contactPersons"
                control={control}
                itemSchema={contactPersonSchema}
              />
            </Tabs.Panel>
            <Tabs.Panel value="businessSizeAndOwnership">
              <BusinessSizeAndOwnership
                register={extendedRegister}
                control={control}
              />
            </Tabs.Panel>
            <Tabs.Panel value="shareHolders">
              <ShareHolders
                name="shareHolders"
                control={control}
                itemSchema={shareHoldersSchema}
              />
            </Tabs.Panel>
            <Tabs.Panel value="beneficialOwnership">
              <BeneficialOwnership
                name="beneficialOwnership"
                control={control}
                itemSchema={beneficialOwnershipSchema}
              />
            </Tabs.Panel>
            {/*  <Tabs.Panel value="areasOfBusinessInterest">
              <AreasOfBusinessInterest form={form} />
            </Tabs.Panel>*/}
            <Tabs.Panel value="bankAccountDetails">
              <BankAccountDetails
                name="bankAccountDetails"
                control={control}
                itemSchema={bankAccountSchema}
              />
            </Tabs.Panel>
            <Tabs.Panel value="supportingDocuments">
              <SupportingDocuments
                register={extendedRegister}
                control={control}
              />
            </Tabs.Panel>

            <input id="res-big-form-submit" type="submit" hidden />
          </form>
          <Flex justify={'end'}>
            <Button onClick={() => onSaveAsDraft()}>Save as Draft</Button>
          </Flex>
        </Flex>
      </Tabs>
      {/* <Text size="sm" fw={500} mt="xl">
        Form values:
      </Text>
      <Code block mt={5}>
        {JSON.stringify(watch(), null, 2)}
      </Code> */}
    </Flex>
  );
};

export default RegistrationForm;

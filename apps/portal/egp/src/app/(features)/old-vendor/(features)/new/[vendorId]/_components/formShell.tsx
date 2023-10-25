'use client';
import React, { useEffect, useState } from 'react';
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
  Code,
  Tabs,
  Flex,
  LoadingOverlay,
  Title,
} from '@mantine/core';
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
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { NotificationService } from '../../../../_components/notification';
import { PopupModal } from '../../../../_components/modal';
import AreasOfBusinessInterest from './areasOfBusinessInterest';
import classes from './tabs.module.scss';
import {
  AutoFillButton,
  vendorInformationData,
} from '../../../../_components/autoFillForm';

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
  console.log(formState.errors);
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
  const [tabState, setTabState] = useState<string | null>(
    'Basic Registration Information',
  );
  const isMobile = useMediaQuery('(max-width: 50em)');
  interface Tabs {
    tabValue: string;
    tabName: string;
    tabDescription: string;
    tabPanelComponent: React.ReactNode;
  }
  const tabs: Tabs[] = [
    {
      tabValue: 'basic',
      tabName: 'Basic Registration',
      tabDescription: 'Basic Registration Information',
      tabPanelComponent: (
        <BasicInfo register={extendedRegister} control={control} />
      ),
    },
    {
      tabValue: 'address',
      tabName: 'Address Information',
      tabDescription: 'Address Information',
      tabPanelComponent: (
        <AddressInformation register={extendedRegister} control={control} />
      ),
    },
    {
      tabValue: 'contactPersons',
      tabName: 'Contact Persons',
      tabDescription: 'Contact Persons List',
      tabPanelComponent: (
        <ContactPersons
          name="contactPersons"
          control={control}
          itemSchema={contactPersonSchema}
        />
      ),
    },
    {
      tabValue: 'businessSizeAndOwnership',
      tabName: 'Business Size and Ownership',
      tabDescription: 'Business Size and Ownership Information',
      tabPanelComponent: (
        <BusinessSizeAndOwnership
          register={extendedRegister}
          control={control}
        />
      ),
    },
    {
      tabValue: 'shareHolders',
      tabName: 'Shareholders',
      tabDescription: 'Shareholders List',
      tabPanelComponent: (
        <ShareHolders
          name="shareHolders"
          control={control}
          itemSchema={shareHoldersSchema}
        />
      ),
    },
    {
      tabValue: 'beneficialOwnership',
      tabName: 'Beneficial Ownership',
      tabDescription: 'Beneficial Ownership List',
      tabPanelComponent: (
        <BeneficialOwnership
          name="beneficialOwnership"
          control={control}
          itemSchema={beneficialOwnershipSchema}
        />
      ),
    },
    {
      tabValue: 'areasOfBusinessInterest',
      tabName: 'Areas of Business Interest',
      tabDescription: 'Areas of Business Interest List',
      tabPanelComponent: (
        <AreasOfBusinessInterest
          name="areasOfBusinessInterest"
          control={control}
          register={extendedRegister}
        />
      ),
    },
    {
      tabValue: 'bankAccountDetails',
      tabName: 'Bank Account Details',
      tabDescription: 'Bank Account Details List',
      tabPanelComponent: (
        <BankAccountDetails
          name="bankAccountDetails"
          control={control}
          itemSchema={bankAccountSchema}
        />
      ),
    },
    {
      tabValue: 'supportingDocuments',
      tabName: 'Supporting Documents',
      tabDescription: 'Supporting Documents',
      tabPanelComponent: (
        <SupportingDocuments register={extendedRegister} control={control} />
      ),
    },
  ];
  const handleTabChange = (value: string) => {
    const selectedTab = tabs.find((tab) => tab.tabValue === value);
    if (selectedTab?.tabDescription) {
      setTabState(selectedTab.tabDescription);
    }
  };
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs
          defaultValue={'basic'}
          orientation={isMobile ? 'horizontal' : 'vertical'}
          onChange={handleTabChange}
          classNames={classes}
        >
          <Tabs.List className="">
            {tabs.map((tab) => (
              <Tabs.Tab
                key={tab.tabValue}
                value={tab.tabValue}
                rightSection={
                  getFieldsHolderError(formState.errors, tab.tabValue) && (
                    <Text color="red">*</Text>
                  )
                }
              >
                {tab.tabName}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <Flex className="w-full flex-col border-b p-4 gap-2">
            <Flex className="items-center rounded-md justify-between w-full p-3 border-2 shadow-sm bg-[var(--mantine-color-body)]">
              <Title order={5} size="calc(0.85rem * var(--mantine-scale))">
                {tabState}
              </Title>
              <Button type="submit">Submit</Button>
            </Flex>
            <Flex className="w-full border rounded-md flex-col gap-4 p-4 px-10 justify-between shadow-sm min-h-[28rem] bg-[var(--mantine-color-body)]">
              {tabs.map((tab) => (
                <Tabs.Panel key={tab.tabValue} value={tab.tabValue}>
                  {tab.tabPanelComponent}
                </Tabs.Panel>
              ))}

              <Flex justify="end" className="gap-2">
                {process.env.NODE_ENV !== 'production' && (
                  <AutoFillButton
                    data={vendorInformationData}
                    setValues={setValue}
                  />
                )}
                <Button onClick={() => onSaveAsDraft()}>Save as Draft</Button>
              </Flex>
            </Flex>
          </Flex>
        </Tabs>
      </form>
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

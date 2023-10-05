'use client';
import {
  Button,
  Card,
  Code,
  Flex,
  LoadingOverlay,
  Tabs,
  Text,
} from '@mantine/core';
import React, { useRef } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  convertToObject,
  generateAndSaveKey,
} from '../../_shared/lib/objectParser/object';
import {
  BeneficialOwnership,
  BasicRegistration,
  AddressInformation,
  ContactPersons,
  BusinessSizeAndOwnership,
  ShareHolders,
  AreasOfBusinessInterest,
  BankAccountDetails,
  SupportingDocuments,
} from './formConfig/parts';
import {
  InitialValues,
  initialValues as initialValuesObject,
} from './formConfig/initialValues';
import { schema } from './formConfig/schema';
import { useLazySaveFormQuery } from '@/store/api/vendor_registration/query';
import { randomId, useDisclosure } from '@mantine/hooks';
import { injectFormValue } from './formConfig/injectFormValue';
import { PopupModal } from '../../_shared/components/modal';
import { IconDraft } from '../../_shared/components/customIcon/index';
import { useRouter } from 'next/navigation';

export default function Form({
  formData,
  formInitiationData,
}: {
  formData: any;
  formInitiationData: any;
}) {
  const [opened, modalHandler] = useDisclosure();
  const navigator = useRouter();
  const initialValues = useRef({ ...initialValuesObject }).current;
  const form = useForm<InitialValues>({
    initialValues,
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });
  const [
    saveFormTrigger,
    {
      data: saveFormData,
      isLoading: isSaveFormLoading,
      isSuccess: isSaveFormSuccess,
      status: saveFormStatus,
    },
  ] = useLazySaveFormQuery();

  React.useEffect(() => {
    if (isSaveFormSuccess && saveFormStatus === 'fulfilled' && saveFormData) {
      saveFormData.status === 'Save as Draft' &&
        notifications.show({
          title: 'Notification',
          message: 'Saved!',
        });
      saveFormData.status === 'Submitted' && modalHandler.open();

      injectFormValue(form, saveFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveFormSuccess, saveFormData, saveFormStatus]);

  React.useEffect(() => {
    return () => {
      if (formData) {
        injectFormValue(form, formData);
      }
      if (formInitiationData) {
        formInitiationData.data.companyName &&
          form.setFieldValue(
            'basicRegistration.nameOfBusinessCompany',
            formInitiationData.data.companyName,
          );
        formInitiationData.data.legalFormofEntity &&
          form.setFieldValue(
            'basicRegistration.formOfBusiness',
            formInitiationData.data.legalFormofEntity,
          );
        formInitiationData.data.Country &&
          form.setFieldValue(
            'basicRegistration.country',
            formInitiationData.data.Country,
          );
        form.setFieldValue(
          'basicRegistration.tinNumber',
          formInitiationData.data.tinNumber
            ? formInitiationData.data.tinNumber
            : '',
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (values: typeof form.values) => {
    saveFormTrigger({
      data: {
        userId: generateAndSaveKey() as string,
        status: 'Save',
        id: formData ? formData.id : '',
        data: {
          ...values,
        },
      },
    });
  };
  const handleSaveAsDraft = (values: typeof form.values) => {
    saveFormTrigger({
      data: {
        userId: generateAndSaveKey() as string,
        status: 'Save as Draft',
        id: formData ? formData.id : '',
        data: {
          ...values,
        },
      },
    });
  };

  return (
    <Card p={0} className="shadow-md">
      <LoadingOverlay
        visible={isSaveFormLoading}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {opened ? (
        <PopupModal
          opened={opened}
          modalHandler={{
            ...modalHandler,
            close: () => {
              modalHandler.close();
              navigator.push('track-applications');
            },
          }}
        >
          <div className="sm:p-6 max-w-2xl sm:max-w-2xl w-full sm:w-full  transition-all shadow-box text-left  bg-white rounded-md overflow-hidden transform-translate-rotate-skew-scale relative">
            <div className=" rounded-full flex justify-center items-center w-12 h-12 mx-auto">
              <IconDraft />
            </div>
            <Text size="xl" className="sm:mt-3 text-center my-1 ">
              Application Form Submitted Successfully
            </Text>
            <Text size="sm" className="sm:mt-3 text-center my-1 ">
              TN:5656/576768/57676
            </Text>
          </div>
        </PopupModal>
      ) : (
        ''
      )}
      <Tabs
        defaultValue="basicRegistration"
        orientation="vertical"
        variant="outline"
      >
        <Tabs.List className="font-[400] text-xs">
          <Tabs.Tab value="basicRegistration">
            <Flex gap={10}>
              <Text> Basic Registration</Text>
              {convertToObject(form.errors, 'basicRegistration') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="addressInformation">
            <Flex gap={10}>
              <Text>Address Information</Text>
              {convertToObject(form.errors, 'addressInformation') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="contactPersons">
            <Flex gap={10}>
              <Text>Contact Persons</Text>
              {convertToObject(form.errors, 'contactPersons') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="businessSizeAndOwnership">
            <Flex gap={10}>
              <Text>Business Size and Ownership</Text>
              {convertToObject(form.errors, 'businessSizeAndOwnership') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="shareHolders">
            <Flex gap={10}>
              <Text>Shareholders</Text>
              {convertToObject(form.errors, 'shareHolders') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="beneficialOwnership">
            <Flex gap={10}>
              <Text>Beneficial Ownership</Text>
              {convertToObject(form.errors, 'beneficialOwnership') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="areasOfBusinessInterest">
            <Flex gap={10}>
              <Text>Areas of Business Interest</Text>
              {convertToObject(form.errors, 'areasOfBusinessInterest') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="bankAccountDetails">
            <Flex gap={10}>
              <Text>Bank Account Details</Text>
              {convertToObject(form.errors, 'bankAccountDetails') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value="supportingDocuments">
            <Flex gap={10}>
              <Text> Supporting Documents</Text>
              {convertToObject(form.errors, 'supportingDocuments') && (
                <Text color="red">*</Text>
              )}
            </Flex>
          </Tabs.Tab>
        </Tabs.List>

        <Flex className="w-full flex-col gap-4 px-10 py-4 justify-between shadow-md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Tabs.Panel value="basicRegistration">
              <BasicRegistration form={form} />
            </Tabs.Panel>
            <Tabs.Panel value="addressInformation">
              <AddressInformation form={form} />
            </Tabs.Panel>
            <Tabs.Panel value="contactPersons">
              <ContactPersons form={form} />
            </Tabs.Panel>
            <Tabs.Panel value="businessSizeAndOwnership">
              <BusinessSizeAndOwnership form={form} />
            </Tabs.Panel>
            <Tabs.Panel value="shareHolders">
              <ShareHolders form={form} />
            </Tabs.Panel>
            <Tabs.Panel value="beneficialOwnership">
              <BeneficialOwnership form={form} />
            </Tabs.Panel>
            <Tabs.Panel value="areasOfBusinessInterest">
              <AreasOfBusinessInterest form={form} />
            </Tabs.Panel>
            <Tabs.Panel value="bankAccountDetails">
              <BankAccountDetails form={form} />
            </Tabs.Panel>
            <Tabs.Panel value="supportingDocuments">
              <SupportingDocuments form={form} />
            </Tabs.Panel>

            <input id="res-big-form-submit" type="submit" hidden />
          </form>
          <Flex justify={'end'}>
            <Button onClick={() => handleSaveAsDraft(form.values)}>
              Save as Draft
            </Button>
          </Flex>
        </Flex>
      </Tabs>
    </Card>
  );
}

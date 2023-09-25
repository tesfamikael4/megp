'use client';
import { Button, Card, Flex, LoadingOverlay, Tabs, Text } from '@mantine/core';
import React from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  convertToObject,
  formGetLatestValues,
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
import { initialValues } from './formConfig/initialValues';
import { schema } from './formConfig/schema';
import { useLazySaveFormQuery } from '@/store/api/vendor_registration/query';
import { SearchParamsToObject } from '../../_shared/lib/url/helper';
import { useGetFormInitiationRequestQuery } from '@/store/api/vendor_registration/query';

export default function Form() {
  const form = useForm({
    initialValues,
    // validate: zodResolver(schema),
    validateInputOnBlur: true,
  });
  const {
    data: getFormInitiationRequestData,
    isLoading: isGetFormInitiationRequestLoading,
    isSuccess: isGetFormInitiationRequestSuccess,
    status: getFormInitiationRequestStatus,
  } = useGetFormInitiationRequestQuery({
    companyName: SearchParamsToObject('companyName'),
    legalFormofEntity: SearchParamsToObject('legalFormOfEntity'),
    country: SearchParamsToObject('countryOfRegistration'),
    tinNumber: SearchParamsToObject('tinNumber'),
  });

  React.useEffect(() => {
    if (
      getFormInitiationRequestData &&
      isGetFormInitiationRequestSuccess &&
      getFormInitiationRequestStatus === 'fulfilled'
    ) {
      getFormInitiationRequestData.data.companyName &&
        form.setFieldValue(
          'basicRegistration.nameOfBusinessCompany',
          getFormInitiationRequestData.data.companyName,
        );
      getFormInitiationRequestData.data.legalFormofEntity &&
        form.setFieldValue(
          'basicRegistration.formOfBusiness',
          getFormInitiationRequestData.data.legalFormofEntity,
        );
      getFormInitiationRequestData.data.country &&
        form.setFieldValue(
          'basicRegistration.country',
          getFormInitiationRequestData.data.country,
        );
      getFormInitiationRequestData.data.tinNumber &&
        form.setFieldValue(
          'basicRegistration.nameOfBusinessCompany',
          getFormInitiationRequestData.data.tinNumber,
        );
    }
    return () => {};
  }, [getFormInitiationRequestData, isGetFormInitiationRequestSuccess]);

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
    if (isSaveFormSuccess && saveFormData) {
      saveFormStatus === 'fulfilled' &&
        notifications.show({
          title: 'Notification',
          message: 'Saved!',
        });

      console.log({
        initialValues,
        newValues: saveFormData,
      });
      form.setValues(saveFormData);
    }
    return () => {};
  }, [isSaveFormSuccess, saveFormData]);

  const handleSubmit = (values: typeof form.values) => {
    saveFormTrigger({
      data: {
        userId: generateAndSaveKey(),
        status: 'Save',
        data: values,
      },
    });
  };
  const handleSaveAsDraft = (values: any) => {
    saveFormTrigger({
      data: {
        userId: generateAndSaveKey(),
        status: 'Save as Draft',
        data: values,
      },
    });
    //  form.setValues({...initialValues});
    // console.log({
    //   status: 'Save as Draft',
    //   values,
    // });
  };
  return (
    <Card
      p={0}
      sx={{
        borderRadius: '7px',
        padding: '0px 10px',
      }}
    >
      <LoadingOverlay
        visible={isSaveFormLoading || isGetFormInitiationRequestLoading}
        overlayBlur={1}
      />

      <Tabs
        defaultValue="basicRegistration"
        orientation="vertical"
        variant="outline"
        styles={(theme) => ({
          tab: {
            ...theme.fn.focusStyles(),
            cursor: 'pointer',
            fontSize: theme.fontSizes.md,
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            marginLeft: '20px',
            borderRadius: '0px',
            width: '300px',
            '&:not(:first-of-type)': {},

            '&:first-of-type': {
              // borderTopLeftRadius: theme.radius.md,
              // borderBottomLeftRadius: theme.radius.md,
            },

            '&:last-of-type': {
              // borderTopRightRadius: theme.radius.md,
              // borderBottomRightRadius: theme.radius.md,
            },

            '&[data-active]': {
              // borderLeft: '7px solid #3d692c',
              background: '#ffffff',
              marginLeft: '7px',
              color: 'rgb(51, 50, 56)',
              borderRadius: '10px 0px 0px 10px',
              width: '277px',
              fontWeight: 500,
            },
          },

          tabIcon: {
            marginRight: theme.spacing.xs,
            display: 'flex',
            alignItems: 'center',
          },

          tabsList: {
            height: '600px',
            width: '284px',
            borderRadius: '14px',
            background: '#e8f1e5',
            padding: '20px 0px',
            color: 'rgb(51, 50, 56)',
          },
          panel: {
            padding: '0px 40px',
            overflow: 'hidden',
          },
          tabLabel: {
            padding: '3px 5px',
          },
        })}
      >
        <Tabs.List>
          <Tabs.Tab value="basicRegistration">Basic Registration</Tabs.Tab>
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

        <Flex direction={'column'} w={'100%'}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Flex justify={'end'}>
              <Flex gap={10}>
                {/* <Button>Review</Button> */}
                <Button type="submit">Submit</Button>
              </Flex>
            </Flex>
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

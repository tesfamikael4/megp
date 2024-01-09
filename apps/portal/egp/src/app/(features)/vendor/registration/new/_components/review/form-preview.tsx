import React from 'react';
import { Accordion, Box, Flex, Table, Text } from '@mantine/core';
import classes from './accordion.module.scss';
import tableClasses from './accordion.module.scss';
import { renderTable } from './renderTable';

const tabs = [
  {
    tabValue: 'basic',
    tabName: 'Basic Registration',
  },
  {
    tabValue: 'address',
    tabName: 'Address Information',
  },
  {
    tabValue: 'contactPersons',
    tabName: 'Contact Persons',
  },
  {
    tabValue: 'businessSizeAndOwnership',
    tabName: 'Business Size and Ownership',
  },
  {
    tabValue: 'shareHolders',
    tabName: 'Shareholders',
  },
  {
    tabValue: 'beneficialOwnership',
    tabName: 'Beneficial Ownership',
  },
  {
    tabValue: 'bankAccountDetails',
    tabName: 'Bank Account Details',
  },
  {
    tabValue: 'supportingDocuments',
    tabName: 'Supporting Documents',
  },
  {
    tabValue: 'paymentReceipt',
    tabName: 'Payment Receipts',
  },
  {
    tabValue: 'businessAreas',
    tabName: 'Business Areas',
  },
];
const formatColumns = {
  contactPersons: [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'email' },
    { name: 'mobileNumber' },
  ],
  businessAreas: [
    { name: 'category' },
    { name: 'priceFrom' },
    { name: 'priceTo' },
    { name: 'currency' },
    { name: 'approvedAt', displayName: 'Approved On' },
    { name: 'expireDate', displayName: 'Expiry Date' },
    { name: 'certificateUrl', displayName: 'Certificate URL' },
  ],
  bankAccountDetails: [
    { name: 'accountHolderFullName', displayName: 'fullName' },
    { name: 'accountNumber' },
    { name: 'bankName' },
    { name: 'branchName' },
    { name: 'branchAddress' },
    { name: 'IBAN' },
    { name: 'isDefualt' },
  ],
  shareHolders: [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'nationality' },
    { name: 'share' },
  ],
};

function addSpacesToCamelCase(input: string): string {
  const spacedString = input.replace(/([a-z])([A-Z])/g, '$1 $2');

  return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
}
const fieldOrder = ['Name', 'Mobile Phone', 'Primary Email'];

function FormPreview({ data }) {
  return (
    <Accordion variant="separated" classNames={classes}>
      {tabs.map((tab) => {
        const { tabValue, tabName } = tab;
        if (data[tabValue]) {
          return (
            <Accordion.Item
              key={tabValue}
              className={classes.item}
              value={tabValue}
            >
              <Accordion.Control>{tabName}</Accordion.Control>
              {Array.isArray(data[tabValue]) ? (
                <Accordion.Panel key={tabValue} className="gap-2 items-center">
                  {renderTable(data[tabValue], formatColumns, tabValue)}{' '}
                </Accordion.Panel>
              ) : (
                Object.keys(data[tabValue]).map((fieldKey) => {
                  return tabValue === 'supportingDocuments' ||
                    tabValue === 'certificate' ||
                    (tabValue === 'paymentReceipt' &&
                      fieldKey === 'attachment') ? (
                    <Accordion.Panel key={fieldKey} className="p-0">
                      <Accordion
                        styles={{
                          content: {
                            padding: 0,
                          },
                        }}
                        key={fieldKey}
                      >
                        <Accordion.Item
                          key={fieldKey ?? addSpacesToCamelCase(tabValue)}
                          styles={{
                            item: {
                              borderBottom: '1px solid #E5E7EB',
                              gap: '0rem',
                            },
                          }}
                          value={
                            addSpacesToCamelCase(fieldKey) ??
                            addSpacesToCamelCase(tabValue)
                          }
                        >
                          <Accordion.Control
                            styles={{
                              control: {
                                border: 'none',
                                borderBottom: '1px solid #E5E7EB',
                              },
                            }}
                          >
                            {addSpacesToCamelCase(fieldKey) ??
                              addSpacesToCamelCase(tabValue)}
                          </Accordion.Control>
                          <Accordion.Panel>
                            {data[tabValue][fieldKey] ? (
                              <></>
                            ) : (
                              <Box className="flex items-center h-20 w-full justify-center">
                                No file uploaded
                              </Box>
                            )}
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    </Accordion.Panel>
                  ) : (
                    <Accordion.Panel key={fieldKey} className="items-center">
                      {typeof data[tabValue][fieldKey] === 'string' &&
                        fieldKey !== 'transactionId' && (
                          <Flex>
                            <Text size="xs" fw={700} tt="capitalize">
                              {addSpacesToCamelCase(fieldKey)}
                            </Text>
                            <Text
                              className="ml-2"
                              size="xs"
                              fw={700}
                              tt="capitalize"
                            >
                              {data[tabValue][fieldKey]}
                            </Text>
                          </Flex>
                        )}
                    </Accordion.Panel>
                  );
                })
              )}
            </Accordion.Item>
          );
        }
        return null;
      })}
    </Accordion>
  );
}

export default FormPreview;

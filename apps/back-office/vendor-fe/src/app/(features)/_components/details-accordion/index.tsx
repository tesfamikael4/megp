import React, { useState } from 'react';
import {
  Accordion,
  Flex,
  Table,
  Text,
  Box,
  ScrollArea,
  Paper,
  Title,
  Divider,
} from '@mantine/core';
import classes from './accordion.module.scss';
import tableClasses from './accordion.module.scss';
import { IconChevronRight } from '@tabler/icons-react';
import { Section } from '@megp/core-fe';

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
    tabValue: 'shareholders',
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
    tabValue: 'vendorAccounts',
    tabName: 'Bank Account Details',
  },
  {
    tabValue: 'areasOfBusinessInterest',
    tabName: 'Areas of Business Interest',
  },
  {
    tabValue: 'customCats',
    tabName: 'Custom Categories',
  },
  {
    tabValue: 'businessCats',
    tabName: 'Business Categories',
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

const filterColumns = {
  vendorAccounts: [
    { name: 'accountHolderFullName', as: 'fullName' },
    { name: 'accountNumber' },
    { name: 'bankName' },
    { name: 'IBAN' },
    { name: 'isDefualt' },
  ],
  contactPersons: [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'email' },
    { name: 'mobileNumber' },
  ],
};

const findATabNameByValue = (value) =>
  tabs.find((tab) => tab.tabValue === value);

function renderTable(data, selected) {
  if (data.length === 0) {
    return null; // No data to display in the table
  }
  function isDate(value: any) {
    const date = new Date(value);

    if (typeof value !== 'string') return false;
    return !isNaN(date.getDate());
  }

  const headers = Object.keys(data[0]);

  return (
    <Box className="overflow-x-auto">
      <Table className={`w-max ${tableClasses}`}>
        <Table.Thead className="w-fit">
          <Table.Tr>
            {filterColumns[selected]
              ? filterColumns[selected].map(
                  (header) =>
                    header !== 'id' && (
                      <Table.Th key={header.name} className="w-fit">
                        {addSpacesToCamelCase(header.as || header.name)}
                      </Table.Th>
                    ),
                )
              : headers.map(
                  (header) =>
                    header !== 'id' && (
                      <Table.Th key={header} className="w-fit">
                        {addSpacesToCamelCase(header)}
                      </Table.Th>
                    ),
                )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item, index) => (
            <Table.Tr key={index}>
              {(filterColumns[selected]
                ? filterColumns[selected]
                : headers
              ).map((header) => {
                if (typeof item[header?.name ?? header] === 'object') {
                  renderTable(
                    item[header?.name ?? header] ?? [],
                    header?.name ?? header,
                  );
                  return null;
                }
                return (
                  (header?.name ?? header) !== 'id' && (
                    <Table.Td key={header?.name ?? header}>
                      {isDate(item[header?.name ?? header])
                        ? new Date(
                            item[header?.name ?? header],
                          ).toLocaleDateString()
                        : typeof item[header?.name ?? header] == 'boolean'
                        ? JSON.stringify(item[header?.name ?? header])
                        : item[header?.name ?? header]}
                    </Table.Td>
                  )
                );
              })}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
function addSpacesToCamelCase(input: string): string {
  const spacedString = input.replace(/([a-z])([A-Z])/g, '$1 $2');

  return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
}
function FormPreview({ data }: { data: any }) {
  const [selected, setSelected] = useState<any>();
  return (
    <Flex gap={'lg'} className="overflow-hidden">
      <Section
        collapsible={false}
        title={'Company Details'}
        className="w-1/3 max-w-md"
      >
        <Box>
          <Accordion
            variant="separated"
            classNames={classes}
            onChange={(data) => {
              setSelected(data);
            }}
            chevronPosition="right"
            chevron={<IconChevronRight />}
            chevronSize={20}
            disableChevronRotation
          >
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
                  </Accordion.Item>
                );
              }
              return null;
            })}
          </Accordion>
        </Box>
      </Section>
      <ScrollArea className="w-full">
        <Section
          collapsible={false}
          title={findATabNameByValue(selected)?.tabName || 'Company Details'}
          className="w-full min-h-[500px]"
        >
          {!selected ||
            (!data[selected] && (
              <Flex
                align={'center'}
                justify={'center'}
                className="w-full min-h-[500px]"
              >
                <Text fw={700}>No data to display</Text>
              </Flex>
            ))}
          {selected &&
            data[selected] &&
            Object.keys(data[selected]).map((fieldKey) => (
              <>
                <Box key={fieldKey}>
                  {typeof data[selected][fieldKey] === 'string' &&
                    data[selected][fieldKey] !== 'Id' && (
                      <Flex className="gap-2 items-center lg:mb-2 text-md lg:text-lg">
                        <Text fw={700} tt="capitalize">
                          {addSpacesToCamelCase(fieldKey)}:
                        </Text>
                        <Text>{data[selected][fieldKey]}</Text>
                      </Flex>
                    )}
                </Box>
              </>
            ))}
          {selected &&
            Array.isArray(data[selected]) &&
            renderTable(data[selected], selected)}
        </Section>
      </ScrollArea>
    </Flex>
  );
}

export default FormPreview;

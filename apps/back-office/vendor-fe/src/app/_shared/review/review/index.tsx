import React from 'react';
import {
  Accordion,
  AccordionItem,
  Flex,
  Table,
  Text,
  Box,
} from '@mantine/core';
import classes from './accordion.module.scss';
import tableClasses from './accordion.module.scss';

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
];

function renderTable(data) {
  if (data.length === 0) {
    return null; // No data to display in the table
  }

  const headers = Object.keys(data[0]);

  return (
    <Box className="overflow-x-auto">
      <Table className={`w-max ${tableClasses}`}>
        <Table.Thead className="w-fit">
          <Table.Tr>
            {headers.map((header) => (
              <Table.Th key={header} className="w-fit">
                {addSpacesToCamelCase(header)}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item, index) => (
            <Table.Tr key={index}>
              {headers.map((header) => (
                <Table.Td key={header}>{item[header]}</Table.Td>
              ))}
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
              {Object.keys(data[tabValue]).map((fieldKey) => (
                <Accordion.Panel key={fieldKey}>
                  {typeof data[tabValue][fieldKey] === 'string' && (
                    <Flex className="gap-2 items-center">
                      <Text size="xs" fw={700} tt="capitalize">
                        {addSpacesToCamelCase(fieldKey)}:
                      </Text>
                      <Text size="xs">{data[tabValue][fieldKey]}</Text>
                    </Flex>
                  )}
                  {Array.isArray(data[tabValue]) && renderTable(data[tabValue])}
                </Accordion.Panel>
              ))}
            </Accordion.Item>
          );
        }
        return null;
      })}
    </Accordion>
  );
}

export default FormPreview;

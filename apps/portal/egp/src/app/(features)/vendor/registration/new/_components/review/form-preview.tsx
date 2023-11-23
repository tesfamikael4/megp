import React from 'react';
import { Accordion, Flex, Table, Text } from '@mantine/core';
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
    <Table classNames={tableClasses}>
      <Table.Thead>
        <Table.Tr>
          {headers.map((header) => (
            <Table.Th key={header}>{addSpacesToCamelCase(header)}</Table.Th>
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
  );
}
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
              {Object.keys(data[tabValue]).map((fieldKey) => (
                <Accordion.Panel key={fieldKey}>
                  {/* {renderField(fieldKey, data[tabValue][fieldKey])} */}
                  {typeof data[tabValue][fieldKey] === 'string' && (
                    <Flex className="gap-2 items-center">
                      <Text size="xs" fw={700} tt="capitalize">
                        {addSpacesToCamelCase(fieldKey)}:
                      </Text>
                      <Text size="xs">{data[tabValue][fieldKey]}</Text>
                    </Flex>
                  )}
                  {typeof data[tabValue][fieldKey] === 'object' &&
                    !Array.isArray(data[tabValue]) && (
                      <Flex className="gap-2 items-center">
                        <Text size="xs" fw={700} tt="capitalize">
                          {addSpacesToCamelCase(fieldKey)}:
                        </Text>
                        {Object.keys(data[tabValue][fieldKey]).map(
                          (nestedKey) => (
                            <Flex
                              className="gap-2 items-center"
                              key={nestedKey}
                            >
                              <Text size="xs" fw={600} tt="capitalize">
                                {addSpacesToCamelCase(nestedKey)}:
                              </Text>
                              <Text size="xs">
                                {data[tabValue][fieldKey][nestedKey]}
                              </Text>
                            </Flex>
                          ),
                        )}
                      </Flex>
                    )}
                  {Array.isArray(data[tabValue]) && renderTable(data[tabValue])}
                </Accordion.Panel>
              ))}
              {}
              {/* {fieldOrder.map((fieldName) => {
                const fieldData = data[tabValue][fieldName];
                if (fieldData !== undefined) {
                  return renderField(fieldName, fieldData);
                }
                return null;
              })}
              {Object.keys(data[tabValue])
                .filter((fieldKey) => !fieldOrder.includes(fieldKey))
                .map((fieldKey) => {
                  const fieldData = data[tabValue][fieldKey];
                  return renderField(fieldKey, fieldData);
                })} */}
            </Accordion.Item>
          );
        }
        return null;
      })}
    </Accordion>
  );
}

export default FormPreview;

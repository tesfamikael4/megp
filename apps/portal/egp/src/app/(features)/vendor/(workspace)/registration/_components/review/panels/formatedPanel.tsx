import { Accordion, Flex, Text } from '@mantine/core';
import { addSpacesToCamelCase, displayFormattedObject } from '../utils';
import { formatColumns } from '../../../_constants';

export const FormattedPanel = ({ data, tabValue }: any) => {
  return (
    <>
      {formatColumns[tabValue].map((field) => {
        return (
          <Accordion.Panel
            key={field.name}
            styles={{
              content: {
                padding: 0,
              },
            }}
            className="gap-x-2 flex items-center border-b"
          >
            <Flex>
              <Text
                size="xs"
                fw={700}
                tt="capitalize"
                w={150}
                className="text-md max:w-1/5 w-1/5 bg-[#DCE8F2] p-3 "
              >
                {addSpacesToCamelCase(field.displayName ?? field.name)}
              </Text>
              <Text className="ml-2 p-3" size="xs" fw={500} tt="capitalize">
                {typeof data[tabValue][field.name] === 'object'
                  ? displayFormattedObject(data[tabValue][field.name], {
                      [field.name]: 'amount+currency',
                    })
                  : data[tabValue][field.name]}
              </Text>
            </Flex>
          </Accordion.Panel>
        );
      })}
    </>
  );
};

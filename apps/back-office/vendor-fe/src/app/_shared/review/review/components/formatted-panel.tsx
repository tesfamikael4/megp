import { formatColumns } from '@/app/(features)/_constants/reviewTabs';
import { RequiredFieldsOnly } from '@/app/(features)/util';
import { addSpacesToCamelCase } from '@/app/(features)/util/addSpaceToCamelCase';
import { displayFormattedObject } from '@/app/(features)/util/displayFormattedObject';
import { Accordion, Flex, Divider, Text } from '@mantine/core';
import Link from 'next/link';

export interface PanelProps {
  data: any;
  tabValue: string;
  fieldKey?: string;
  setUrl?: React.Dispatch<React.SetStateAction<string>>;
  open?: () => void;
  userId?: string;
}

export const FormattedPanel = ({
  data,
  tabValue,
}: RequiredFieldsOnly<PanelProps>) => {
  return (
    <>
      {formatColumns(data?.basic?.countryOfRegistration)[tabValue].map(
        (field) => {
          if (
            field.name === 'tinIssuedDate' &&
            data[tabValue]?.origin !== 'Malawi'
          ) {
            return null;
          }
          return (
            <>
              <Accordion.Panel
                key={field.name}
                className="gap-x-2 items-center"
                styles={{
                  panel: {
                    padding: 0,
                  },
                  content: {
                    padding: 0,
                  },
                }}
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
                  <Text
                    className="ml-2 my-auto"
                    size="xs"
                    fw={500}
                    tt="capitalize"
                  >
                    {typeof data[tabValue][field.name] === 'object' ? (
                      displayFormattedObject(data[tabValue][field.name], {
                        [field.name]: 'amount+currency',
                      })
                    ) : field.name === 'website' ? (
                      <Link
                        target="_blank"
                        href={data[tabValue][field.name] ?? '#'}
                      >
                        {data[tabValue][field.name]}
                      </Link>
                    ) : (
                      data[tabValue][field.name]
                    )}
                  </Text>
                </Flex>
                <Divider />
              </Accordion.Panel>
            </>
          );
        },
      )}
    </>
  );
};

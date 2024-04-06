import {
  Accordion,
  Button,
  Divider,
  Flex,
  TabsPanelProps,
  Text,
} from '@mantine/core';
import {
  addSpacesToCamelCase,
  displayFormattedObject,
  formatDateTimeFromString,
  isDate,
} from '../utils';
import Link from 'next/link';

interface PanelProps {
  data: any;
  tabValue: string;
  fieldKey?: string;
  setUrl?: React.Dispatch<
    React.SetStateAction<{ url: string; filename: string }>
  >;
  open?: () => void;
  userId?: string;
}

export const MiscellaneousPanel = ({
  data,
  fieldKey,
  tabValue,
  setUrl,
  open,
  userId,
}: Required<PanelProps>) => {
  if (!['invoiceIds', 'invoiceId', 'serviceId'].includes(fieldKey))
    return (
      <Accordion.Panel
        key={fieldKey}
        styles={{
          panel: {
            padding: 0,
          },
          content: {
            padding: 0,
          },
        }}
      >
        {data !== null &&
          typeof data === 'object' &&
          fieldKey !== 'invoiceIds' && (
            <Flex align="center" gap={'md'}>
              <Text
                size="xs"
                fw={700}
                tt="capitalize"
                className="text-md max:w-1/5 w-1/5 bg-[#DCE8F2] p-3"
              >
                {addSpacesToCamelCase(fieldKey)}
              </Text>
              <Text size="xs" fw={500} tt="capitalize">
                {tabValue === 'businessSizeAndOwnership'
                  ? displayFormattedObject(data, {
                      [fieldKey]: 'amount+currency',
                    })
                  : Object.keys(data).map((key) => {
                      return (
                        <MiscellaneousPanel
                          key={key}
                          data={data[key]}
                          fieldKey={key}
                          tabValue={tabValue}
                          setUrl={setUrl}
                          open={open}
                          userId={userId}
                        />
                      );
                    })}
              </Text>
            </Flex>
          )}

        {typeof data === 'string' && (
          <Flex align="center" gap="md">
            <Text
              size="xs"
              fw={700}
              tt="capitalize"
              className="text-md max:w-1/5 w-1/5 bg-[#DCE8F2] p-3 "
            >
              {addSpacesToCamelCase(fieldKey)}
            </Text>
            {data.endsWith('.pdf') ? (
              <Button
                onClick={() => {
                  open();
                  setUrl({
                    url: `${
                      process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'
                    }upload/get-file-bo/preferential-documents/${data}/${userId}`,
                    filename: data,
                  });
                }}
              >
                View
              </Button>
            ) : (
              <Text size="xs" fw={500} tt="capitalize">
                {isDate(data) ? (
                  formatDateTimeFromString(data)
                ) : fieldKey === 'website' ? (
                  <Link href={data} target="_blank">
                    {data}
                  </Link>
                ) : (
                  addSpacesToCamelCase(data)
                )}
              </Text>
            )}
          </Flex>
        )}
        <Divider />
      </Accordion.Panel>
    );
};

import { ShowFile } from '@/app/(features)/_components/details-accordion';
import { formatDateTimeFromString, isDate } from '@/app/(features)/util';
import { addSpacesToCamelCase } from '@/app/(features)/util/addSpaceToCamelCase';
import { displayFormattedObject } from '@/app/(features)/util/displayFormattedObject';
import { Accordion, Flex, Modal, Divider, Text, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PanelProps } from './formatted-panel';

const MiscellaneousPanel = ({
  data,
  fieldKey,
  tabValue,
  setUrl,
  open,
  userId,
}: Required<PanelProps>) => {
  const [opened, { close, open: openModal }] = useDisclosure(false);
  const attachmentURL = `${
    process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'
  } upload /get-file-bo/preferential-documents/${data}/${userId}`;
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
      {typeof data === 'string' &&
        !fieldKey.endsWith('Id') &&
        !fieldKey.endsWith('Ids') && (
          <Flex align="center" gap="md">
            <Text
              size="xs"
              fw={700}
              tt="capitalize"
              className="text-md max:w-1/5 w-1/5 bg-[#DCE8F2] p-3 "
            >
              {addSpacesToCamelCase(fieldKey)}
            </Text>
            {data.endsWith('.pdf') ||
            data.endsWith('.png') ||
            data.endsWith('.jpg') ? (
              <>
                <Modal
                  opened={opened}
                  onClose={close}
                  size={'60%'}
                  centered
                  title={'Attachment'}
                  bg={'transparent'}
                >
                  {<ShowFile url={attachmentURL} filename={data[tabValue]} />}
                </Modal>
                <Button
                  onClick={() => {
                    openModal();
                  }}
                >
                  View
                </Button>
              </>
            ) : (
              <Text size="xs" fw={500} tt="capitalize">
                {isDate(data) ? formatDateTimeFromString(data) : data}
              </Text>
            )}
          </Flex>
        )}
      <Divider />
    </Accordion.Panel>
  );
};

export default MiscellaneousPanel;

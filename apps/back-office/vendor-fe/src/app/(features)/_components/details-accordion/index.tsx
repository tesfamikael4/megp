import React, { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  Flex,
  Table,
  Text,
  Box,
  Modal,
  Image,
  Divider,
} from '@mantine/core';
import classes from './accordion.module.scss';
import { IconChevronRight } from '@tabler/icons-react';
import { Section, logger } from '@megp/core-fe';
import { getCookie } from 'cookies-next';
import { useDisclosure } from '@mantine/hooks';
import { renderTable } from '../../util/renderTable';
import { addSpacesToCamelCase } from '../../util/addSpaceToCamelCase';
import { displayFormattedObject } from '../../util/displayFormattedObject';
import Link from 'next/link';
import { accordionTabs, formatColumns } from '../../_constants/reviewTabs';

const tabs = (countryOfRegistration) => [
  {
    tabValue: 'certificate',
    tabName: 'Certificate',
  },
  ...accordionTabs(countryOfRegistration),
];

const findATabNameByValue = (value, originalTabs) =>
  originalTabs.find((tab) => tab.tabValue === value);

function FormPreview({ data }: { data: any }) {
  const [selected, setSelected] = useState<any>();
  const [opened, { close, open }] = useDisclosure(false);
  const [url, setUrl] = useState(null);
  return (
    <Flex gap={'lg'} className="overflow-hidden">
      <Section
        collapsible={false}
        title={'Company Details'}
        className="min:w-1/3 max-w-md"
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
            {tabs(data?.basic?.countryOfRegistration).map((tab) => {
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
      <TabsRightSide
        data={data}
        selected={selected}
        setUrl={setUrl}
        currentTab={data[selected]}
        open={open}
        filteredColumns={formatColumns(data?.countryOfRegistration)}
      />

      <Modal
        opened={opened}
        onClose={close}
        size={'60%'}
        centered
        title={'Attachment'}
      >
        {url && <ShowFile url={url} filename={data[selected]} />}
      </Modal>
    </Flex>
  );
}

export default FormPreview;

export const TabsRightSide = ({
  data,
  selected,
  setUrl,
  currentTab,
  open,
  filteredColumns,
}: {
  data: any;
  selected: any;
  setUrl: any;
  currentTab: any;
  open: () => void;
  filteredColumns?: any;
}) => {
  return (
    <Section
      collapsible={false}
      title={
        findATabNameByValue(selected, tabs(data?.basic?.countryOfRegistration))
          ?.tabName || 'Company Details'
      }
      className="w-2/3 min-h-[700px]"
      w="66.666667%"
    >
      {!selected ||
        (!currentTab && (
          <Flex
            align={'center'}
            justify={'center'}
            className="w-full min-h-[700px]"
          >
            <Text fw={700}>No data to display</Text>
          </Flex>
        ))}

      {selected &&
        currentTab &&
        (typeof currentTab === 'string' ? (
          <Accordion variant="separated" styles={{}} key={currentTab}>
            <Accordion.Item
              key={addSpacesToCamelCase(selected)}
              className={classes.item}
              value={addSpacesToCamelCase(selected)}
            >
              <Accordion.Control
                styles={{
                  control: {
                    border: 'none',
                    borderBottom: '1px solid #E5E7EB',
                  },
                }}
              >
                {addSpacesToCamelCase(selected)}
              </Accordion.Control>
              <Accordion.Panel>
                {currentTab ? (
                  <ShowFile
                    url={`${
                      process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api'
                    }/upload/get-file-bo/${
                      selected === 'supportingDocuments'
                        ? 'SupportingDocument'
                        : selected === 'certificate'
                          ? 'certificate'
                          : 'paymentReceipt'
                    }/${currentTab}/${data?.userId}`}
                    filename={currentTab}
                  />
                ) : (
                  <Box className="flex items-center h-20 w-full justify-center">
                    No file uploaded
                  </Box>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ) : Array.isArray(currentTab) ? (
          <Table.ScrollContainer
            minWidth={300}
            style={{
              minWidth: '100px',
            }}
          >
            {renderTable(
              currentTab,
              formatColumns(data?.countryOfRegistration),
              selected,
              open,
              setUrl,
              data.userId,
            )}
          </Table.ScrollContainer>
        ) : (
          (filteredColumns[selected] ?? Object.keys(currentTab)).map(
            (_fieldKey: any) => {
              const fieldKey = filteredColumns[selected]
                ? _fieldKey.name
                : _fieldKey;

              return selected === 'supportingDocuments' ||
                selected === 'certificate' ||
                (selected === 'paymentReceipt' && fieldKey === 'attachment') ? (
                <Accordion variant="separated" styles={{}} key={fieldKey}>
                  <Accordion.Item
                    key={fieldKey ?? addSpacesToCamelCase(selected)}
                    className={classes.item}
                    value={
                      addSpacesToCamelCase(fieldKey) ??
                      addSpacesToCamelCase(selected)
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
                        addSpacesToCamelCase(selected)}
                    </Accordion.Control>
                    <Accordion.Panel>
                      {currentTab[fieldKey] ? (
                        <ShowFile
                          url={`${
                            process.env.NEXT_PUBLIC_VENDOR_API ??
                            '/vendors/api/'
                          }upload/get-file-bo/${
                            selected === 'supportingDocuments'
                              ? 'SupportingDocument'
                              : selected === 'certificate'
                                ? 'Certificate'
                                : 'paymentReceipt'
                          }/${currentTab[fieldKey]}/${data?.userId}`}
                          filename={currentTab[fieldKey]}
                        />
                      ) : (
                        <Box className="flex items-center h-20 w-full justify-center">
                          No file uploaded
                        </Box>
                      )}
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              ) : (
                <>
                  <Divider />
                  <Box key={fieldKey} className="gap-2 items-center ">
                    {selected === 'address' && fieldKey === 'website' && (
                      <Flex className="" align="center" gap={'lg'}>
                        <Text
                          size="xs"
                          fw={500}
                          tt="capitalize"
                          className="text-md max:w-1/5 w-1/5 bg-[#DCE8F2] p-3 "
                        >
                          Website:
                        </Text>
                        <Text size="sm" tt="capitalize">
                          {(filteredColumns[selected] ?? currentTab)[
                            fieldKey
                          ] ? (
                            <Link
                              href={currentTab[fieldKey]}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {currentTab[fieldKey]}
                            </Link>
                          ) : (
                            'No website provided'
                          )}
                        </Text>
                      </Flex>
                    )}

                    {typeof currentTab[fieldKey] === 'string' &&
                      fieldKey !== 'website' && (
                        <>
                          <Flex className="" align="center" gap={'lg'}>
                            <Text
                              size="xs"
                              fw={500}
                              tt="capitalize"
                              className="text-md max:w-1/5 w-1/5 bg-[#DCE8F2] p-3 "
                            >
                              {addSpacesToCamelCase(fieldKey)}:
                            </Text>
                            <Text size="sm" tt="capitalize">
                              {currentTab[fieldKey]}
                            </Text>
                          </Flex>
                        </>
                      )}
                    {currentTab[fieldKey] !== null &&
                      typeof currentTab[fieldKey] === 'object' &&
                      fieldKey !== 'invoiceIds' && (
                        <Flex className="" align={'center'} gap={'lg'}>
                          <Text
                            size="xs"
                            fw={500}
                            tt="capitalize"
                            className="text-md max:w-1/5 w-1/5 bg-[#DCE8F2] p-3 "
                          >
                            {addSpacesToCamelCase(fieldKey)}
                          </Text>
                          <Text
                            className="text-center"
                            size="sm"
                            tt="capitalize"
                          >
                            {selected === 'businessSizeAndOwnership'
                              ? displayFormattedObject(currentTab[fieldKey], {
                                  [fieldKey]: 'amount+currency',
                                })
                              : currentTab[fieldKey]}
                          </Text>
                          <Text
                            className="text-center"
                            size="sm"
                            tt="capitalize"
                          >
                            {selected === 'shareHolders' &&
                              currentTab[fieldKey]}
                          </Text>
                        </Flex>
                      )}
                  </Box>
                  <Divider />
                </>
              );
            },
          )
        ))}
    </Section>
  );
};

export const ShowFile = ({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) => {
  const [opened, { close, open }] = useDisclosure(false);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null); // Use null as initial state
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const getFile = useCallback(async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error fetching file');
      }
      const fileBlob = await response.blob();
      const blobType = fileBlob.type;

      const readArrayBuffer = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to convert Blob to ArrayBuffer'));
            }
          };
          reader.onerror = () => {
            reject(new Error('Error reading Blob as ArrayBuffer'));
          };
          reader.readAsArrayBuffer(blob);
        });
      };

      if (blobType.includes('image')) {
        const fileUrl = URL.createObjectURL(fileBlob);
        setFileContent(fileUrl);
      } else if (
        blobType.includes('pdf') ||
        blobType.includes('octet-stream')
      ) {
        const arrayBuffer = (await readArrayBuffer(fileBlob)) as ArrayBuffer;
        setPdfData(arrayBuffer);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      logger.log(err);
    }
  }, [url]);

  useEffect(() => {
    getFile();
  }, [getFile]);

  if (error) {
    return (
      <div>
        <p className="text-center py-2 text-md">{`
    Looks like something went wrong while loading the file.
    Double-check your connection and try reloading`}</p>
      </div>
    );
  }

  return (
    <>
      <ImageModal opened={opened} close={close} url={fileContent as string} />
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ height: '500px' }}
      >
        {pdfData ? (
          <iframe
            src={`data:application/pdf;base64,${Buffer.from(pdfData).toString(
              'base64',
            )}`}
            width="100%"
            height="100%"
            title={filename}
          />
        ) : fileContent ? (
          <Image
            src={fileContent}
            alt={filename}
            className="cursor-pointer "
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onClick={() => open()}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

const ImageModal = ({
  opened,
  close,
  url,
}: {
  opened: boolean;
  close: () => void;
  url: string;
}) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      size={'80%'}
      centered
      title={'Attachment'}
    >
      <Image src={url} alt="" />
    </Modal>
  );
};

'use client';

import React, { useEffect, useState } from 'react';
import {
  Accordion,
  Box,
  Button,
  Flex,
  Image,
  Modal,
  Table,
  Text,
} from '@mantine/core';
import classes from './accordion.module.scss';
import { renderTable } from './renderTable';
import { addSpacesToCamelCase, displayFormattedObject } from './utils';
import { useDisclosure } from '@mantine/hooks';
import { getCookie } from 'cookies-next';
import { logger } from '@megp/core-fe';

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
  beneficialOwnership: [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'nationality' },
  ],
  shareHolders: [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'nationality' },
    { name: 'share' },
  ],
};

function FormPreview({ data }: { data: any }) {
  const [url, setUrl] = useState('');
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Accordion variant="separated" classNames={classes}>
      {tabs.map((tab) => {
        const { tabValue, tabName } = tab;
        if (data[tabValue]) {
          return (
            <>
              <Modal
                opened={opened}
                onClose={close}
                size={'60%'}
                centered
                title={'Attachment'}
              >
                {url && <ShowFile url={url} filename={data[tabValue]} />}
              </Modal>
              <Accordion.Item
                key={tabValue}
                className={classes.item}
                value={tabValue}
              >
                <Accordion.Control>{tabName}</Accordion.Control>
                {Array.isArray(data[tabValue]) ? (
                  <Accordion.Panel
                    key={tabValue}
                    className="gap-2 items-center"
                  >
                    {renderTable(data[tabValue], formatColumns, tabValue)}
                  </Accordion.Panel>
                ) : formatColumns[tabValue] ? (
                  formatColumns[tabValue].map((field) => {
                    return (
                      <Accordion.Panel
                        key={field.name}
                        className="gap-2 items-center"
                      >
                        <Flex>
                          <Text
                            size="xs"
                            fw={700}
                            tt="capitalize"
                            w={150}
                            py={4}
                            px={2}
                          >
                            {addSpacesToCamelCase(
                              field.displayName ?? field.name,
                            )}
                          </Text>
                          <Text
                            className="ml-2"
                            size="xs"
                            fw={500}
                            tt="capitalize"
                          >
                            {data[tabValue][field.name]}
                          </Text>
                        </Flex>
                      </Accordion.Panel>
                    );
                  })
                ) : (
                  Object.keys(data[tabValue]).map((fieldKey) => {
                    return tabValue === 'supportingDocuments' ||
                      tabValue === 'certificate' ? (
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
                                <ShowFile
                                  url={`${
                                    process.env.NEXT_PUBLIC_VENDOR_API ??
                                    '/vendors/api/'
                                  }upload/get-file-bo/${
                                    tabValue === 'supportingDocuments'
                                      ? 'SupportingDocument'
                                      : tabValue === 'certificate'
                                        ? 'Certificate'
                                        : 'paymentReceipt'
                                  }/${data[tabValue][fieldKey]}/${data?.userId}`}
                                  filename={data[tabValue][fieldKey]}
                                />
                              ) : (
                                <Box className="flex items-center h-20 w-full justify-center">
                                  No file uploaded
                                </Box>
                              )}
                            </Accordion.Panel>
                          </Accordion.Item>
                        </Accordion>
                      </Accordion.Panel>
                    ) : tabValue === 'paymentReceipt' &&
                      fieldKey === 'attachment' ? (
                      <Accordion.Panel key={fieldKey} className="items-center">
                        <Flex direction={'column'}>
                          <ShowFile
                            url={`${
                              process.env.NEXT_PUBLIC_VENDOR_API ??
                              '/vendors/api/'
                            }upload/get-file-bo/${'paymentReceipt'}/${
                              data[tabValue][fieldKey]
                            }/${data?.userId}`}
                            filename={data[tabValue][fieldKey]}
                          />
                        </Flex>
                      </Accordion.Panel>
                    ) : (
                      <Accordion.Panel key={fieldKey} className="items-center">
                        {data[tabValue][fieldKey] !== null &&
                          typeof data[tabValue][fieldKey] === 'object' &&
                          fieldKey !== 'invoiceIds' && (
                            <Flex className=" border-b px-1.5 ">
                              <Text
                                size="xs"
                                fw={700}
                                tt="capitalize"
                                className="text-lg w-1/5 "
                              >
                                {addSpacesToCamelCase(fieldKey)}
                              </Text>
                              <Text
                                className="ml-2"
                                size="xs"
                                fw={500}
                                tt="capitalize"
                              >
                                {tabValue === 'businessSizeAndOwnership'
                                  ? displayFormattedObject(
                                      data[tabValue][fieldKey],
                                      {
                                        [fieldKey]: 'amount+currency',
                                      },
                                    )
                                  : data[tabValue][fieldKey]}
                              </Text>
                            </Flex>
                          )}
                        {typeof data[tabValue][fieldKey] === 'string' &&
                          fieldKey !== 'transactionId' &&
                          fieldKey !== 'invoiceIds' &&
                          fieldKey !== 'serviceId' && (
                            <Flex>
                              <Text
                                size="xs"
                                fw={700}
                                tt="capitalize"
                                w={150}
                                px={2}
                              >
                                {addSpacesToCamelCase(fieldKey)}
                              </Text>
                              {data[tabValue][fieldKey].endsWith('.pdf') ? (
                                <Button
                                  onClick={() => {
                                    open();
                                    setUrl(
                                      `${
                                        process.env.NEXT_PUBLIC_VENDOR_API ??
                                        '/vendors/api/'
                                      }upload/get-file-bo/preferential-documents/${data[tabValue][fieldKey]}/${data.userId}`,
                                    );
                                  }}
                                >
                                  View
                                </Button>
                              ) : (
                                <Text
                                  className="ml-2"
                                  size="xs"
                                  fw={700}
                                  tt="capitalize"
                                >
                                  {data[tabValue][fieldKey]}
                                </Text>
                              )}
                            </Flex>
                          )}
                      </Accordion.Panel>
                    );
                  })
                )}
              </Accordion.Item>
            </>
          );
        }
        return null;
      })}
    </Accordion>
  );
}

export default FormPreview;

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

  useEffect(() => {
    const getFile = async () => {
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

        // Check if the blob is an image or a PDF
        if (blobType.includes('image')) {
          const fileUrl = URL.createObjectURL(fileBlob);
          setFileContent(fileUrl);
        } else if (blobType.includes('pdf')) {
          const arrayBuffer = await new Promise<ArrayBuffer>(
            (resolve, reject) => {
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
              reader.readAsArrayBuffer(fileBlob);
            },
          );
          setPdfData(arrayBuffer);
        } else if (blobType.includes('octet-stream')) {
          const arrayBuffer = await new Promise<ArrayBuffer>(
            (resolve, reject) => {
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
              reader.readAsArrayBuffer(fileBlob);
            },
          );
          setPdfData(arrayBuffer);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        logger.log(err);
      }
    };

    getFile();
  }, [url]);

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

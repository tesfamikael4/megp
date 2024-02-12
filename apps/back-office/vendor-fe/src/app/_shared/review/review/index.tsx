import React, { useState } from 'react';
import {
  Accordion,
  Flex,
  Text,
  Box,
  Button,
  Modal,
  Divider,
} from '@mantine/core';
import classes from './accordion.module.scss';
import { ShowFile } from '@/app/(features)/_components/details-accordion';
import { renderTable } from '@/app/(features)/util/renderTable';
import { addSpacesToCamelCase } from '@/app/(features)/util/addSpaceToCamelCase';
import { displayFormattedObject } from '@/app/(features)/util/displayFormattedObject';
import { useDisclosure } from '@mantine/hooks';
import {
  RequiredFieldsOnly,
  formatDateTimeFromString,
  isDate,
} from '@/app/(features)/util';

const tab = [
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
  address: [
    { name: 'mobilePhone' },
    { name: 'primaryEmail' },
    { name: 'postalAddress' },
    { name: 'alternateEmail' },
    { name: 'telephone' },
  ],
  businessSizeAndOwnership: [
    { name: 'registeredCapital' },
    { name: 'paidUpCapital' },
    { name: 'numberOfEmployees' },
    { name: 'ownershipType' },
  ],
  beneficialOwnership: [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'nationality' },
  ],
  service: [{ name: 'name', displayName: 'Service Type' }],
};

function FormPreview({
  data,
  uniqueTabs = [],
}: {
  data: any;
  uniqueTabs?: { tabValue: string; tabName: string }[];
}) {
  const tabs = [...uniqueTabs, ...tab];

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
                bg={'transparent'}
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
                    className="items-center"
                    styles={{
                      panel: {
                        padding: 0,
                      },
                      content: {
                        padding: 0,
                      },
                    }}
                  >
                    {renderTable(data[tabValue], formatColumns, tabValue)}
                  </Accordion.Panel>
                ) : formatColumns[tabValue] ? (
                  <FormattedPanel data={data} tabValue={tabValue} />
                ) : (
                  <RenderObject
                    data={data}
                    tabValue={tabValue}
                    setUrl={setUrl}
                    open={open}
                  />
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

interface PanelProps {
  data: any;
  tabValue: string;
  fieldKey?: string;
  setUrl?: React.Dispatch<React.SetStateAction<string>>;
  open?: () => void;
  userId?: string;
}

const RenderObject = ({
  data,
  tabValue,
  setUrl,
  open,
}: {
  data: any;
  tabValue: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  open: () => void;
}): React.ReactNode => {
  return (
    <>
      {Object.keys(data[tabValue]).map((fieldKey) => {
        return tabValue === 'supportingDocuments' ||
          tabValue === 'certificate' ? (
          <DocumentPanel data={data} tabValue={tabValue} fieldKey={fieldKey} />
        ) : tabValue === 'paymentReceipt' && fieldKey === 'attachment' ? (
          <PaymentReceiptPanel
            data={data}
            tabValue={tabValue}
            fieldKey={fieldKey}
          />
        ) : (
          <MiscellaneousPanel
            data={data[tabValue]?.[fieldKey]}
            fieldKey={fieldKey}
            tabValue={tabValue}
            setUrl={setUrl}
            open={open}
            userId={data?.userId}
          />
        );
      })}
    </>
  );
};

const FormattedPanel = ({ data, tabValue }: RequiredFieldsOnly<PanelProps>) => {
  return (
    <>
      {formatColumns[tabValue].map((field) => {
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
                  {typeof data[tabValue][field.name] === 'object'
                    ? displayFormattedObject(data[tabValue][field.name], {
                        [field.name]: 'amount+currency',
                      })
                    : data[tabValue][field.name]}
                </Text>
              </Flex>
              <Divider />
            </Accordion.Panel>
          </>
        );
      })}
    </>
  );
};

const DocumentPanel = ({
  data,
  tabValue,
  fieldKey,
}: {
  data: any;
  tabValue: string;
  fieldKey: string;
}) => {
  return (
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
            addSpacesToCamelCase(fieldKey) ?? addSpacesToCamelCase(tabValue)
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
            {addSpacesToCamelCase(fieldKey) ?? addSpacesToCamelCase(tabValue)}
          </Accordion.Control>
          <Accordion.Panel>
            {data[tabValue]?.[fieldKey] ? (
              <ShowFile
                url={`${
                  process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'
                }upload/get-file-bo/${
                  tabValue === 'supportingDocuments'
                    ? 'SupportingDocument'
                    : tabValue === 'certificate'
                      ? 'Certificate'
                      : 'paymentReceipt'
                }/${data[tabValue]?.[fieldKey]}/${data?.userId}`}
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
  );
};

const PaymentReceiptPanel = ({
  data,
  tabValue,
  fieldKey,
}: {
  data: any;
  tabValue: string;
  fieldKey: string;
}) => {
  return (
    <Accordion.Panel key={fieldKey} className="items-center">
      <Flex direction={'column'}>
        <ShowFile
          url={`${
            process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'
          }upload/get-file-bo/${'paymentReceipt'}/${
            data[tabValue]?.[fieldKey]
          }/${data?.userId}`}
          filename={data[tabValue]?.[fieldKey]}
        />
      </Flex>
    </Accordion.Panel>
  );
};

const MiscellaneousPanel = ({
  data,
  fieldKey,
  tabValue,
  setUrl,
  open,
  userId,
}: Required<PanelProps>) => {
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
        fieldKey !== 'transactionId' &&
        fieldKey !== 'invoiceIds' &&
        fieldKey !== 'invoiceId' &&
        fieldKey !== 'serviceId' && (
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
                  setUrl(
                    `${
                      process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'
                    }upload/get-file-bo/preferential-documents/${data}/${userId}`,
                  );
                }}
              >
                View
              </Button>
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

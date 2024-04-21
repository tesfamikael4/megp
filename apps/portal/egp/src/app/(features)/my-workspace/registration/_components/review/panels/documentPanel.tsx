import { Accordion, Box } from '@mantine/core';
import { addSpacesToCamelCase } from '../utils';
import { ShowFile } from './showFile';

export const DocumentPanel = ({
  data,
  tabValue,
  fieldKey,
}: {
  data: any;
  tabValue: string;
  fieldKey: string;
}) => {
  if (!data[tabValue]?.[fieldKey]) return null;
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
              // borderBottom: '1px solid #E5E7EB',
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
                // borderBottom: '1px solid #E5E7EB',
              },
            }}
          >
            {addSpacesToCamelCase(fieldKey) ?? addSpacesToCamelCase(tabValue)}
          </Accordion.Control>
          <Accordion.Panel className="pb-5">
            {data[tabValue]?.[fieldKey] ? (
              <ShowFile
                url={`${
                  process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api'
                }/upload/get-file-bo/${
                  tabValue === 'supportingDocuments'
                    ? 'SupportingDocument'
                    : tabValue === 'certificate'
                      ? 'Certificate'
                      : 'paymentReceipt'
                }/${data[tabValue]?.[fieldKey]}/${data?.userId}`}
                filename={data[tabValue][fieldKey]}
                zoom
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

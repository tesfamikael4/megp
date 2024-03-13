import { Accordion, Flex } from '@mantine/core';
import { ShowFile } from './showFile';

export const PaymentReceiptPanel = ({
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

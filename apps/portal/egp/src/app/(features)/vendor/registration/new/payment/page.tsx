'use client';
import { Flex, Button } from '@mantine/core';
import React from 'react';
import InvoiceTemplate from '../../../_components/dynamicPrintComponent/invoice';
import { getCookie } from 'cookies-next';
import { useGetFormQuery } from '../_api/query';

function Page() {
  const vendorId = getCookie('vendorId') || ' ';
  const requestInfo = useGetFormQuery({
    vendorId,
  });
  return (
    <Flex className="flex-col p-4">
      <Flex className=" flex-col gap-2">
        {requestInfo.data && (
          <InvoiceTemplate
            invoiceData={requestInfo.data?.invoice[0]}
            sizeType="lg"
          />
        )}
        <Flex justify="end" className="gap-2 mt-4">
          <Button type="submit">Pay</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Page;

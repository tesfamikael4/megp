'use client';

import { Box, LoadingOverlay, Text, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useGetApprovedVendorByIdQuery } from '../../_api/reports';
import { ShowFile } from '../../vendor/(workspace)/registration/_components/review/panels/showFile';
import { NotificationService } from '../../vendor/_components/notification';

const VendorDetail = () => {
  const param = useParams();
  const router = useRouter();
  const { data, isLoading, isError } = useGetApprovedVendorByIdQuery({
    id: param.id as string,
  });
  if (isError) {
    NotificationService.requestErrorNotification('Error on fetching data');
    return router.push(`/vendors`);
  }
  return (
    <Section
      className="bg-white "
      collapsible={false}
      mh="400px"
      title={<Text>{data?.name ?? 'Vendor'} Details</Text>}
    >
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          <Text className="font-semibold p-2 bg-gray-50">Certificate</Text>
          <Box>
            <ShowFile
              url={`${
                process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api/'
              }upload/get-vendor-certificate/${
                data && data['certificate']
              }/${data?.userId}`}
              filename={data && data['certificate']}
              zoom
            />
          </Box>
        </>
      )}
    </Section>
  );
};

export default VendorDetail;

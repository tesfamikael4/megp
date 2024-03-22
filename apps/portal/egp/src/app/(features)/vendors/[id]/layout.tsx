'use client';

import { Box, LoadingOverlay, Text, Tooltip } from '@mantine/core';
import { Section } from '@megp/core-fe';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { useGetApprovedVendorByIdQuery } from '../../_api/reports';
import { ShowFile } from '../../vendor/(workspace)/registration/_components/review/panels/showFile';

const VendorDetail = () => {
  const param = useParams();
  const { data, isLoading } = useGetApprovedVendorByIdQuery({
    id: param.id as string,
  });
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
            <ShowFile url={''} filename="" />
          </Box>
        </>
      )}
    </Section>
  );
};

export default VendorDetail;

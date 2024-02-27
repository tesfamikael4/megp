'use client';
import {
  useLazyGetRejectedApplicationDetailQuery,
  useLazyGetVendorDetailQuery,
} from '@/store/api/vendor_request_handler/approved-rejected-api';
import { Avatar, Box, Flex, Paper, Skeleton } from '@mantine/core';
import { IconBriefcase, IconProgress, IconTicket } from '@tabler/icons-react';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import VendorDetail from '../../_components/vendor-details';

export default function VendorsDetail() {
  const { vendorId } = useParams();
  const [response, setResponse] = useState<any>({});
  const [getVendorDetail] = useLazyGetVendorDetailQuery();
  const [getRejecteVendorDetail] = useLazyGetRejectedApplicationDetailQuery();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('type') === 'approved')
      getVendorDetail({ vendorId: vendorId as string })
        .unwrap()
        .then((res) => {
          setResponse(res);
        });
    else
      getRejecteVendorDetail({ vendorId: vendorId as string })
        .unwrap()
        .then((res) => {
          setResponse(res);
        });
  }, [vendorId, searchParams.get('type')]);

  if (!response) {
    return (
      <Paper className="p-5">
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={10} radius="xl" />
        <Skeleton height={8} mt={10} width="70%" radius="xl" />
      </Paper>
    );
  }

  return (
    <Suspense>
      <Paper className="p-3 w-full">
        <Flex direction="row" className="items-center">
          <Flex direction="row" className="w-8/12">
            <Box className="p-3">
              <Avatar color="cyan" radius="xl" size="lg">
                {response?.name?.charAt(0)}
              </Avatar>
            </Box>
            <Flex
              direction="column"
              className="w-full border-r-[1px] text-sm justify-center"
            >
              <Box className="text-primary-800 font-bold" size="xl">
                {response?.name}
              </Box>
              <Box>Country: {response?.origin}</Box>
            </Flex>
          </Flex>
          <Flex direction="column" className="border-l-gray-50 w-4/12 ml-3">
            <Flex direction="row" className="items-center gap-1 text-sm">
              <IconTicket size={18} />
              <Box>{response?.tin}</Box>
            </Flex>
            <Flex direction="row" className="items-center gap-1 text-sm">
              <IconBriefcase size={18} />
              <Box>{response?.formOfEntity}</Box>
            </Flex>
            <Flex direction="row" className="items-center gap-1 text-sm">
              <IconProgress size={18} />
              <Box>
                {response.status === 'Inprogress' ? 'In progress' : 'Completed'}
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Paper>
      <Box className="mt-3">
        <Box className="w-full min-h-400 overflow-x-hidden">
          <VendorDetail data={response} />
        </Box>
      </Box>
    </Suspense>
  );
}

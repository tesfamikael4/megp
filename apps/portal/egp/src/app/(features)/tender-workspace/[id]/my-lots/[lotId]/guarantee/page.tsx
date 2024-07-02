'use client';
import { useLazyGetGuaranteesQuery } from '@/store/api/guarantee/guarantee.api';
import { useGetRegisteredBidQuery } from '@/store/api/registered-bid/registered-bid.api';
import { Box, Button, Divider, Flex, Text } from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import Table from '../components/table/table';
import { useEffect } from 'react';

const GuaranteePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { lotId } = useParams();

  const [trigger, { data: guarantees }] = useLazyGetGuaranteesQuery();

  const { data: tenderData } = useGetRegisteredBidQuery(id?.toString());

  const handleButtonClick = () => {
    router.push(`/tender-workspace/${id}/my-lots/${lotId}/guarantee/new`);
  };
  useEffect(() => {
    trigger(lotId.toString());
  }, [lotId, trigger]);

  return (
    <>
      <Box className="p-6 w-full bg-[#e7f4f7]">
        <Text fw={600} fz="xl" className="mb-3 text-[#1d8e3f]">
          {tenderData?.name}
        </Text>
        <Box className=" w-full p-6 min-h-screen bg-white">
          <Flex direction={'column'} className="w-full py-2 mb-3 ">
            <Flex justify="space-between">
              <Text fw={600} fz="xl">
                Guarantee List
              </Text>

              <Button
                disabled={guarantees?.status === 'APPROVED'}
                onClick={handleButtonClick}
              >
                New Guarantee
              </Button>
            </Flex>
            <Divider />
          </Flex>

          <Table data={guarantees} tenderData={tenderData} />
        </Box>
      </Box>
    </>
  );
};

export default GuaranteePage;

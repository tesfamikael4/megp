'use client';
import {
  Box,
  Container,
  Text,
  Tooltip,
  Flex,
  LoadingOverlay,
} from '@mantine/core';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useCallback } from 'react';
import { IconChevronLeft } from '@tabler/icons-react';
import Guarantees from '../../_components/guarantee';
import SubmittedBidders from '../../_components/submitted-bidders';
import { useReadQuery } from '../../_api/tender.api';
export default function TenderDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { tenderId } = useParams();
  const { data: selected, isLoading } = useReadQuery(tenderId?.toString());

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <div className="bg-white -mt-4 -mr-4 -ml-4">
        <div className="container mx-auto ">
          <div className="pt-10 pb-10 text-black font-bold text-2xl flex justify-between">
            <Tooltip
              label="List of Tenders"
              className="cursor-pointer"
              onClick={() => router.push(`/preparation`)}
              position="top-start"
            >
              <Flex align="center">
                <IconChevronLeft />
                {selected?.name}
              </Flex>
            </Tooltip>
          </div>
          <div className="flex">
            <div>
              {
                <div className="flex space-x-4">
                  <Text
                    className={
                      searchParams.get('tab') === 'guarantee'
                        ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                        : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                    }
                    onClick={() => {
                      router.push(
                        pathname + '?' + createQueryString('tab', 'guarantee'),
                      );
                    }}
                  >
                    Guarantee
                  </Text>
                  <Text
                    className={
                      searchParams.get('tab') === 'submitted-bidders'
                        ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-10 font-medium text-center'
                        : ' pointer text-gray-700 py-2 px-10 font-medium text-center'
                    }
                    onClick={() => {
                      router.push(
                        pathname +
                          '?' +
                          createQueryString('tab', 'submitted-bidders'),
                      );
                    }}
                  >
                    Submitted Bidders
                  </Text>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <Box className="container mx-auto my-4">
        <Container fluid>
          {searchParams.get('tab') === 'guarantee' && (
            <>
              <Guarantees />
            </>
          )}
          {searchParams.get('tab') === 'submitted-bidders' && (
            <>
              <SubmittedBidders />
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

'use client';
import {
  Text,
  useCombobox,
  Tooltip,
  Flex,
  LoadingOverlay,
  Box,
  Select,
} from '@mantine/core';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useCallback, useState } from 'react';
import { IconChevronLeft } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import {
  useGetAllLotsQuery,
  useTenderDetailQuery,
} from '@/app/(features)/vendor/_api/registration.api';
import BidDeclarationPage from './_components/bid-declaration';
import TechnicalOfferPage from './_components/technical-offer';
import FinancialOfferPage from './_components/financial-offer';

export default function TenderDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const { id } = useParams();
  const { data: selected, isLoading } = useTenderDetailQuery(id?.toString());
  const { data: lots, isLoading: lotLoading } = useGetAllLotsQuery(
    id?.toString(),
  );
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
      <LoadingOverlay visible={isLoading || lotLoading} />
      <div className="bg-white">
        <div className="container mx-auto ">
          <div className="pt-10 pb-10 text-black font-bold text-2xl flex justify-between">
            <Tooltip
              label="List of Tenders"
              className="cursor-pointer"
              onClick={() => {
                localStorage.removeItem('password');
                router.push(`/check-password`);
              }}
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
              <div className="flex space-x-4">
                <Text
                  className={
                    searchParams.get('tab') === 'bid-declaration'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'bid-declaration' as string),
                    );
                  }}
                >
                  Bid Declaration
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'technical-offer'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'technical-offer' as string),
                    );
                  }}
                >
                  Technical Offer
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'financial-offer'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'financial-offer' as string),
                    );
                  }}
                >
                  Financial Offer
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'bid-security'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'bid-security' as string),
                    );
                  }}
                >
                  Bid Security
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Box className="w-full flex flex-row justify-between items-center container my-2">
        <p className="text-lg font-semibold">
          <Select
            placeholder="Pick Lot"
            value={searchParams.get('lot')}
            data={
              lots
                ? lots.items.map((single) => {
                    const value = { ...single };
                    value['label'] = value.name;
                    value['value'] = value.id;
                    return value;
                  })
                : []
            }
            onChange={(value) => {
              router.push(
                pathname + '?' + createQueryString('lot', value as string),
              );
            }}
          />
        </p>
      </Box>
      <Box className="mx-4">
        {searchParams.get('tab') === 'bid-declaration' && (
          <>
            <BidDeclarationPage />
          </>
        )}
        {searchParams.get('tab') === 'technical-offer' && (
          <>
            <TechnicalOfferPage />
          </>
        )}
        {searchParams.get('tab') === 'financial-offer' && (
          <>
            <FinancialOfferPage />
          </>
        )}
      </Box>
    </>
  );
}

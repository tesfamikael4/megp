'use client';
import {
  Box,
  useCombobox,
  Tooltip,
  Flex,
  LoadingOverlay,
  Select,
  Button,
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
import FormsPage from './_components/forms';

export default function TenderDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const { tenderId } = useParams();
  const { data: selected, isLoading } = useTenderDetailQuery(
    tenderId?.toString(),
  );
  const { data: lots, isLoading: lotLoading } = useGetAllLotsQuery(
    tenderId?.toString(),
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
            <Box>{selected?.name}</Box>
            <Button
              variant="filled"
              className="my-auto"
              onClick={() => {
                sessionStorage.removeItem('password');
                router.push(`/vendor/my-tenders/${tenderId}/check-password`);
              }}
            >
              Release Key
            </Button>
          </div>
          <div className="flex">
            <div>
              <div className="flex space-x-4">
                <Box
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
                </Box>
                <Box
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
                  Technical Compliance Sheet
                </Box>
                <Box
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
                  Price Schedule
                </Box>
                <Box
                  className={
                    searchParams.get('tab') === 'forms'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'forms' as string),
                    );
                  }}
                >
                  Forms
                </Box>
                <Box
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
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Box className="w-full flex flex-row justify-between items-center container my-2">
        <Box className="text-lg font-semibold">
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
        </Box>
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
        {searchParams.get('tab') === 'forms' && (
          <>
            <FormsPage />
          </>
        )}
      </Box>
    </>
  );
}

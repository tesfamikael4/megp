'use client';
import {
  Flex,
  Tooltip,
  useCombobox,
  Text,
  LoadingOverlay,
  Box,
} from '@mantine/core';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { IconChevronLeft } from '@tabler/icons-react';
import TechnicalRequirement from '../../_components/item/sor/technical-requirement/technical-requirement';
import { useCallback, useState } from 'react';
import { DetailItem } from '../../_components/item/detail-item';
import { useReadQuery } from '../../_api/lot/items.api';
import { useReadQuery as useReadTenderDetail } from '../../_api/tender/tender.api';
import BillOfMaterial from '../../_components/item/sop/bill-of-material/bill-of-material';
import { SorType } from '@/models/tender/lot/item/technical-requirement.model';
import Labour from '../../_components/item/sop/labour/labour';
import Material from '../../_components/item/sop/material/material';
import Equipment from '../../_components/item/sop/equipment/equipment';
import Document from '../../_components/item/document/document';
import Fee from '../../_components/item/sop/fee/fee';
import ReimburseableExpense from '../../_components/item/sop/reimburseable-expense/reimburseable-expense';
export default function ItemDetailPage() {
  const router = useRouter();
  const { id, itemId } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: selected, isLoading } = useReadQuery(itemId?.toString());
  const { data: tender } = useReadTenderDetail(id?.toString());
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <div className="bg-white -mt-4 -mr-4 -ml-4">
        <div className="container mx-auto ">
          <div className="pt-10 max-w-2xl pb-10">
            <div>
              <div className="text-lg font-medium mt-4 pt-4 pb-4">
                <Tooltip
                  label="Tender Detail"
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/preparation/${id}?tab=configuration`)
                  }
                  position="top-start"
                >
                  <Flex align="center">
                    <IconChevronLeft />
                    {tender?.name}
                  </Flex>
                </Tooltip>
              </div>
              <Text className="text-black font-bold text-2xl">
                {selected?.name}
              </Text>
            </div>
          </div>
          <div className="flex">
            <div>
              <div className="flex space-x-4">
                <Text
                  className={
                    searchParams.get('tab') === 'configuration'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 pointer  px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'configuration' as string),
                    );
                  }}
                >
                  Configuration
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'sor'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 pointer px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'sor' as string),
                    );
                  }}
                >
                  Schedule of requirement
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'sop'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 pointer px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'sop' as string),
                    );
                  }}
                >
                  Schedule of price
                </Text>
                <Text
                  className={
                    searchParams.get('tab') === 'document'
                      ? 'border-l bg-gray-100 pointer text-gray-700 border-t border-r border-gray-200 rounded-tl-md rounded-tr-md py-2 px-12 font-medium text-center'
                      : ' pointer text-gray-700 py-2 pointer px-12 font-medium text-center'
                  }
                  onClick={() => {
                    router.push(
                      pathname +
                        '?' +
                        createQueryString('tab', 'document' as string),
                    );
                  }}
                >
                  Document
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Box className="container mx-auto my-4">
        {searchParams.get('tab') === 'configuration' && selected && (
          <DetailItem cell={selected} />
        )}
        {searchParams.get('tab') === 'sor' && (
          <>
            <div className="my-4">
              <TechnicalRequirement
                item={selected}
                type={SorType.SPECIFICATION}
              />
            </div>
            <div className="my-4">
              <TechnicalRequirement item={selected} type={SorType.PERSONAL} />
            </div>

            <div className="my-4">
              <TechnicalRequirement item={selected} type={SorType.DELIVERY} />
            </div>

            <div className="my-4">
              <TechnicalRequirement item={selected} type={SorType.PACKAGING} />
            </div>

            <div className="my-4">
              <TechnicalRequirement item={selected} type={SorType.WARRANTY} />
            </div>
            <div className="my-4">
              <TechnicalRequirement item={selected} type={SorType.INCIDENTAL} />
            </div>
          </>
        )}
        {searchParams.get('tab') === 'sop' && (
          <>
            <div className="my-4">
              <BillOfMaterial item={selected} />
            </div>
            <div className="my-4">
              <Labour item={selected} />
            </div>
            <div className="my-4">
              <Material item={selected} />
            </div>
            <div className="my-4">
              <Equipment item={selected} />
            </div>
            <div className="my-4">
              <Fee item={selected} />
            </div>
            <div className="my-4">
              <ReimburseableExpense item={selected} />
            </div>
          </>
        )}
        {searchParams.get('tab') === 'document' && (
          <>
            <div className="my-4">
              <Document item={selected} />
            </div>
          </>
        )}
      </Box>
    </>
  );
}

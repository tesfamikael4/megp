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
import { useCallback } from 'react';
import { DetailItem } from '../../_components/item/detail-item';
import { useReadQuery } from '../../_api/lot/items.api';
import { useReadQuery as useReadTenderDetail } from '../../_api/tender/tender.api';
import BillOfMaterial from '../../_components/item/sop/bill-of-material/bill-of-material';
import Labour from '../../_components/item/sop/labour/labour';
import Material from '../../_components/item/sop/material/material';
import Equipment from '../../_components/item/sop/equipment/equipment';
import Document from '../../_components/item/document/document';
import Fee from '../../_components/item/sop/fee/fee';
import ReimburseableExpense from '../../_components/item/sop/reimburseable-expense/reimburseable-expense';
import { Item, ProcurementCategory } from '@/models/tender/lot/item';
import { SorType as GoodsSorType } from '@/models/tender/lot/item/goods.model';
import { SorType as WorksSorType } from '@/models/tender/lot/item/work.model';
import { SorType as ConsultancySorType } from '@/models/tender/lot/item/consultancy';
import { SorType as NonConsultancySorType } from '@/models/tender/lot/item/non-consultancy.model';
export default function ItemDetailPage() {
  const router = useRouter();
  const { id, itemId } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: selected, isLoading } = useReadQuery<{
    data: Item;
    isLoading: boolean;
  }>(itemId?.toString());
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
  const sorTypeDefinition = (sorTypes) => {
    return Object.keys(sorTypes).map((sorType) => (
      <div className="my-4" key={sorType}>
        <TechnicalRequirement
          item={selected}
          type={sorType}
          title={sorTypes[sorType]}
        />
      </div>
    ));
  };
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
            {selected?.procurementCategory &&
              ((selected.procurementCategory === ProcurementCategory.GOODS &&
                sorTypeDefinition(GoodsSorType)) ||
                (selected.procurementCategory === ProcurementCategory.WORKS &&
                  sorTypeDefinition(WorksSorType)) ||
                (selected.procurementCategory ===
                  ProcurementCategory.CONSULTANCYSERVICES &&
                  sorTypeDefinition(ConsultancySorType)) ||
                (selected.procurementCategory ===
                  ProcurementCategory.NONCONSUTANCYSERVICES &&
                  sorTypeDefinition(NonConsultancySorType)))}
          </>
        )}
        {searchParams.get('tab') === 'sop' && (
          <>
            <div className="my-4">
              {selected?.procurementCategory &&
                (selected.procurementCategory === ProcurementCategory.GOODS ||
                  selected.procurementCategory === ProcurementCategory.WORKS ||
                  selected.procurementCategory ===
                    ProcurementCategory.NONCONSUTANCYSERVICES) && (
                  <BillOfMaterial item={selected} />
                )}
            </div>
            <div className="my-4">
              {selected?.procurementCategory &&
                (selected.procurementCategory ===
                  ProcurementCategory.NONCONSUTANCYSERVICES ||
                  selected.procurementCategory ===
                    ProcurementCategory.WORKS) && <Labour item={selected} />}
            </div>
            <div className="my-4">
              {selected?.procurementCategory &&
                (selected.procurementCategory ===
                  ProcurementCategory.NONCONSUTANCYSERVICES ||
                  selected.procurementCategory ===
                    ProcurementCategory.WORKS) && <Material item={selected} />}
            </div>
            <div className="my-4">
              {selected?.procurementCategory &&
                (selected.procurementCategory ===
                  ProcurementCategory.NONCONSUTANCYSERVICES ||
                  selected.procurementCategory ===
                    ProcurementCategory.WORKS) && <Equipment item={selected} />}
            </div>
            <div className="my-4">
              {selected?.procurementCategory &&
                (selected.procurementCategory ===
                  ProcurementCategory.NONCONSUTANCYSERVICES ||
                  selected.procurementCategory ===
                    ProcurementCategory.WORKS) && <Fee item={selected} />}
            </div>
            <div className="my-4">
              {selected?.procurementCategory &&
                (selected.procurementCategory ===
                  ProcurementCategory.NONCONSUTANCYSERVICES ||
                  selected.procurementCategory ===
                    ProcurementCategory.WORKS) && (
                  <ReimburseableExpense item={selected} />
                )}
            </div>
          </>
        )}
        {searchParams.get('tab') === 'document' && (
          <>
            <div className="my-4">
              <Document />
            </div>
          </>
        )}
      </Box>
    </>
  );
}

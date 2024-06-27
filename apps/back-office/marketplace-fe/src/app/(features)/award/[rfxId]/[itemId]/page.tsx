'use client';
import {
  Badge,
  Box,
  Container,
  Flex,
  LoadingOverlay,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronUp,
} from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useReadQuery } from '@/app/(features)/rfx/_api/rfx/items.api';
import { useState } from 'react';
import { ExpandableTable, Section } from '@megp/core-fe';
import ItemConfiguration from '@/app/(features)/rfx/_components/item/item-configuration';
import { useLazyGetWinnersQuery } from '@/store/api/rfx/rfx.api';

export default function ItemDetail() {
  const router = useRouter();
  const { itemId } = useParams();
  const [showItemDetail, setShowItemDetail] = useState(false);
  const { data, isLoading: isGettingDetail } = useReadQuery(itemId?.toString());
  const [trigger, { data: winnersList, isFetching }] = useLazyGetWinnersQuery();

  const config = {
    columns: [
      {
        accessor: 'name',
        title: 'Vendor Name',
        render: (value) => <>{value?.solRegistration?.vendorName}</>,
      },
      { accessor: 'rank' },
      {
        accessor: 'calculatedPrice',
        title: 'Price',
        render: (value) => <> MKW {value?.calculatedPrice}</>,
      },
    ],
    isExpandable: false,
    isSearchable: true,
    primaryColumn: 'name',
    isLoading: isFetching,
  };

  const onRequestChange = (request: any) => {
    trigger({
      collectionQuery: { ...request },
      itemId: itemId?.toString(),
    });
  };

  return (
    <>
      <Stack>
        <Box className="bg-white">
          <Container size="xl" className="pt-4">
            <Stack>
              <Text className="text-md font-medium ml-4">
                {data?.rfx?.name}
              </Text>
              <Flex align="center" className="gap-2 py-4">
                <IconChevronLeft
                  size={34}
                  onClick={() => router.back()}
                  className="cursor-pointer"
                />
                <Flex className="gap-4 items-center">
                  <Text className="font-semibold text-lg">
                    {data?.name ?? ''}
                  </Text>
                  {!showItemDetail && (
                    <Badge
                      className="bg-primary-6 min-w-fit cursor-pointer"
                      rightSection={<IconChevronDown size={10} />}
                      variant="outline"
                      onClick={() => setShowItemDetail(!showItemDetail)}
                    >
                      See More
                    </Badge>
                  )}
                  {showItemDetail && (
                    <Badge
                      className="bg-primary-6 min-w-fit cursor-pointer"
                      rightSection={<IconChevronUp size={10} />}
                      variant="outline"
                      onClick={() => setShowItemDetail(!showItemDetail)}
                    >
                      See Less
                    </Badge>
                  )}
                </Flex>
              </Flex>
              {showItemDetail && <ItemConfiguration />}
            </Stack>
          </Container>
        </Box>
        <Box>
          <LoadingOverlay visible={isGettingDetail} />
          <Section title="Ranking" collapsible={false}>
            <ExpandableTable
              config={config}
              data={winnersList?.items ?? []}
              total={winnersList?.total ?? 0}
              onRequestChange={onRequestChange}
            />
          </Section>
        </Box>
      </Stack>
    </>
  );
}

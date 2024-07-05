'use client';
import {
  Badge,
  Box,
  Button,
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
import {
  useCanSendAwardQuery,
  useLazyGetWinnersQuery,
  useSendAwardMutation,
} from '@/store/api/rfx/rfx.api';

export default function ItemDetail() {
  const router = useRouter();
  const { rfxId, itemId } = useParams();
  const [showItemDetail, setShowItemDetail] = useState(false);
  const { data, isLoading: isGettingDetail } = useReadQuery(itemId?.toString());
  const [trigger, { data: winnersList, isFetching }] = useLazyGetWinnersQuery();
  const [sendAward, { isLoading: isSending }] = useSendAwardMutation();
  const { data: canSendAward } = useCanSendAwardQuery({
    itemId: itemId?.toString(),
  });

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
        render: (value) => (
          <> MKW {parseFloat(value?.calculatedPrice)?.toFixed(2)}</>
        ),
      },
      {
        accessor: '',
        title: 'Actions',
        width: 200,
        render: (value) =>
          value?.id == canSendAward?.id ? (
            <Button
              onClick={async () =>
                await sendAward({
                  rfxItemId: value?.rfxItemId,
                  openedOfferId: value?.id,
                  solRegistrationId: value?.solRegistration?.id,
                  rfxId: rfxId.toString(),
                })
              }
              loading={isSending}
            >
              Send Award
            </Button>
          ) : value?.awardItem?.status == 'PENDING' ? (
            <Button disabled={true}>Pending Award Acceptance</Button>
          ) : value?.awardItem?.status == 'CANCELLED' ? (
            <Button disabled={true} className="bg-red-500">
              Rejected Award
            </Button>
          ) : null,
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
              {showItemDetail && (
                <Box className="p-4">
                  <ItemConfiguration />
                </Box>
              )}
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

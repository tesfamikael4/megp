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
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronUp,
} from '@tabler/icons-react';
import { useReadQuery } from '../../../_api/rfx/items.api';
import ItemConfiguration from '../../../_components/item/item-configuration';
import SOR from '../../../_components/item/schedule-of-requirment';

export default function ItemDetailPage() {
  const router = useRouter();
  const { itemId } = useParams();
  const { data: selected } = useReadQuery(itemId?.toString());
  const [showItemDetail, setShowItemDetail] = useState(false);
  const { data, isLoading: isGettingDetail } = useReadQuery(itemId?.toString());

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
          <SOR item={selected} />
        </Box>
      </Stack>
    </>
  );
}

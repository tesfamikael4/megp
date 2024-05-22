import {
  useLazyReadItemQuery,
  useReadItemQuery,
} from '@/store/api/item-master/item-master.api';
import {
  Card,
  Group,
  Text,
  Menu,
  ActionIcon,
  Image,
  rem,
  Box,
  Badge,
  Button,
} from '@mantine/core';
import { IconDotsVertical, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import {
  useLazyDownloadFilesQuery,
  useLazyGetFilesQuery,
} from '../_api/catalog.api';
import { useEffect } from 'react';

export default function ProductCard({ data }) {
  const route = useRouter();

  const [triggerItem, { data: item }] = useLazyReadItemQuery();
  useEffect(() => {
    triggerItem(data.itemMasterId);
  }, [data.itemMasterId, triggerItem]);
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      key={data.id}
      className={`w-full`}
      h={290}
    >
      <Card.Section>
        <Image
          src={data?.presignedUrl}
          className="h-48 mt-2"
          fit="cover"
          alt="product image"
        />
      </Card.Section>
      <Group justify="space-between" mt="sm" mb="xs">
        <Text fw={500}>{data?.name}</Text>
        <Badge color="pink">
          <Group
            className="ml-auto"
            onClick={() => {
              route.push(
                `catalog-manager/${data.itemMasterId}/product/${data.id}`,
              );
            }}
          >
            <IconPencil size={14} />
          </Group>{' '}
        </Badge>
      </Group>

      <Box className="">
        <Text size="sm" c="dimmed" lineClamp={4}>
          {item?.description}
        </Text>
      </Box>
    </Card>
  );
}

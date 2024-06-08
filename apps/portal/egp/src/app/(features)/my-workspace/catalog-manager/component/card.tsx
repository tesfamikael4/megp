import { useLazyReadItemQuery } from '@/store/api/item-master/item-master.api';
import { Card, Group, Text, Image, Box, Badge } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

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
      className={`w-full cursor-pointer`}
      h={290}
      onClick={() => {
        route.push(`catalog-manager/${data.itemMasterId}/product/${data.id}`);
      }}
    >
      <Card.Section>
        <Image
          src={data?.presignedUrl}
          className="h-48 mt-2 object-cover"
          fit="contain"
          w="auto"
          h="auto"
          alt="product image"
        />
      </Card.Section>
      <Group justify="space-between" mt="sm" mb="xs">
        <Text fw={500}>{data?.name}</Text>
        <Badge color="#1D8E3F" size="md">
          <Group
            className="ml-auto cursor-pointer"
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

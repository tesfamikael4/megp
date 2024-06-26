import { useLazyReadItemQuery } from '@/store/api/item-master/item-master.api';
import { Card, Group, Text, Image, Box, Badge, Divider } from '@mantine/core';
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
      padding="sm"
      radius="md"
      withBorder
      key={data.id}
      className={`w-full cursor-pointer`}
      h={290}
      onClick={() => {
        route.push(`catalog-manager/${data.itemMasterId}/product/${data.id}`);
      }}
    >
      <Card.Section h={160}>
        <Box className="h-120 relative w-full h-full overflow-hidden">
          <Image
            src={data?.presignedUrl}
            unstyled
            alt="Product image"
            className="object-contain w-full h-full"
          />
        </Box>
      </Card.Section>
      <Divider my={'lg'} />

      <Text size="sm" c="dimmed" lineClamp={4}>
        {item?.description}
      </Text>
    </Card>
  );
}

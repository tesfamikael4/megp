import { useReadItemQuery } from '@/store/api/item-master/item-master.api';
import {
  Card,
  Group,
  Text,
  Menu,
  ActionIcon,
  Image,
  SimpleGrid,
  rem,
  Badge,
  Box,
  Button,
} from '@mantine/core';
import { IconDotsVertical, IconPencil, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { FileViewer } from '../../_components/file-viewer';

import { useLazyDownloadFilesQuery } from '../_api/catalog.api';
import { useEffect } from 'react';

export default function ProductCard({ data }) {
  const route = useRouter();
  const { data: itemMaster } = useReadItemQuery(data.itemMasterId);

  const [dowloadPrFile, { data: url, isLoading: isPrLoading }] =
    useLazyDownloadFilesQuery();

  useEffect(() => {
    dowloadPrFile('931f1eb2-1a11-488c-8307-c283d79641c7');
  }, []);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="w-1/3 flex-grow-0"
      style={{ width: `calc(33.33% - 1rem)` }}
      h={300}
    >
      <Group>
        <Menu withinPortal position="bottom-end" shadow="sm">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical style={{ width: rem(16), height: rem(16) }} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => {
                // logger.log('Delete', data);
                route.push(
                  `catalog-manager/${data.itemMasterId}/product/${data.id}`,
                );
              }}
              leftSection={
                <IconPencil style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Edit
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Card.Section>
        <Image radius="md" src={url?.presignedUrl} />
      </Card.Section>

      <Box className="h-fit mb-2 mt-2">
        <Text size="sm" c="dimmed" lineClamp={4}>
          {itemMaster?.description}
        </Text>
      </Box>
    </Card>
  );
}

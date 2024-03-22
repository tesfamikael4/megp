import { DeleteButton } from '@/app/(features)/_components/delete-button';
import { Box, Card, Flex, Group, Image, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { ShowFile } from '../../_components/review/panels/showFile';

const DocumentDetail = ({ row, setRow }: any) => {
  const [status, setStatus] = useState('');
  return (
    <Box className="relative w-full shadow-xs rounded-md" px={'sm'}>
      <Flex align="center" fw={700} justify="space-between" py={'xs'}>
        {' '}
        <Text>Document Detail</Text>{' '}
        <IconX
          size={20}
          onClick={() => setRow(null)}
          className="absolute top-2 right-2 cursor-pointer"
          color="red"
        />
      </Flex>
      <Card padding="lg" radius="md">
        <Card.Section>
          <ShowFile
            setStatus={setStatus}
            filename={row.attachmentId}
            url={`${process.env.NEXT_PUBLIC_VENDOR_API ?? '/vendors/api'}/briefcases/download/${row.attachmentId}`}
          />
        </Card.Section>
        {status === 'success' && (
          <>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>
                Name:{' '}
                {row.attachmentId?.substring(
                  0,
                  row?.attachmentId?.indexOf('.'),
                )}
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              Size: {row && (row as any).size}
            </Text>
            <Flex justify={'flex-end'}>
              <DeleteButton
                onDelete={() => setRow(null)}
                buttonName="Delete"
                title={`Delete ${row && (row as any).name}`}
                message={`Are you sure you want to delete ${row && (row as any).name}`}
              />
            </Flex>
          </>
        )}
      </Card>
    </Box>
  );
};

export default DocumentDetail;

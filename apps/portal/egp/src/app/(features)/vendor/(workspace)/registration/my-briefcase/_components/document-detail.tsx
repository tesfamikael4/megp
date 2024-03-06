import { DeleteButton } from '@/app/(features)/_components/delete-button';
import { Box, Card, Flex, Group, Image, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import React from 'react';

const DocumentDetail = ({ row, setRow }: any) => {
  return (
    <Box className="relative">
      <Card shadow="md" padding="lg" radius="md">
        <Card.Section>
          <Image
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
            height={160}
            width={160}
            alt="Norway"
          />
        </Card.Section>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Name: {row && (row as any).name}</Text>
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
        <IconX
          size={20}
          onClick={() => setRow(null)}
          className="absolute top-2 right-2 cursor-pointer"
          color="red"
        />
      </Card>
    </Box>
  );
};

export default DocumentDetail;

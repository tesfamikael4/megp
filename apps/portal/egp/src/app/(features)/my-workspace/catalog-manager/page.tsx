'use client';
import { useRouter } from 'next/navigation';
import { useLazyListCatalogsQuery } from './_api/catalog.api';
import { Section } from '@megp/core-fe';
import { Box, Button, Flex, Group, Pagination } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ItemSelector from './component/Item-selector-copy';
import ProductCard from './component/card';
import { useEffect, useState } from 'react';

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }
  return Math.ceil(totalItems / itemsPerPage);
}

const perPage = 8;

export default function CatalogList() {
  const [opened, { open, close }] = useDisclosure(false);

  const route = useRouter();
  const [getCatalog, { data: list, isLoading, isError }] =
    useLazyListCatalogsQuery();
  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(list?.count ?? 0, perPage);

  const handleDone = (data) => {
    route.push(`/my-workspace/catalog-manager/${data.id}/new`);
    close();
  };

  useEffect(() => {
    const from = (page - 1) * perPage;
    getCatalog({ skip: from, take: perPage });
  }, [getCatalog, page]);

  return (
    <>
      <Section
        title="Product catalog"
        collapsible={false}
        action={
          <Button onClick={open}>
            <IconPlus size={14} /> Add
          </Button>
        }
      >
        <Box
          mih={'100vh'}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {list?.items?.map((item, index) => (
            <ProductCard data={item} key={index} />
          ))}
        </Box>
        <Group className="ml-auto mb-6">
          <Pagination
            className="ml-auto"
            onChange={setPage}
            size="sm"
            total={totalPages}
            value={page}
            withEdges
          />
        </Group>
      </Section>

      <ItemSelector onDone={handleDone} opened={opened} close={close} />
    </>
  );
}

'use client';
import { useRouter } from 'next/navigation';
import { useLazyListCatalogsQuery } from './_api/catalog.api';
import { Section } from '@megp/core-fe';
import { Box, Button, Flex, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ItemSelector from './component/Item-selector-copy';
import ProductCard from './component/card';
import { useEffect } from 'react';
export default function CatalogList() {
  const [opened, { open, close }] = useDisclosure(false);

  const route = useRouter();
  const [getCatalog, { data: list, isLoading, isError }] =
    useLazyListCatalogsQuery();

  const handleDone = (data) => {
    route.push(`/my-workspace/catalog-manager/${data.id}/new`);
    close();
  };

  useEffect(() => {
    getCatalog(undefined);
  }, []);

  return (
    <>
      <Section
        title="Product catalog"
        collapsible={false}
        action={
          <Button onClick={open}>
            {' '}
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
      </Section>

      <ItemSelector onDone={handleDone} opened={opened} close={close} />
    </>
  );
}
